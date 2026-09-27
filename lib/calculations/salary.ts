import { applyRate, divRoundHalfUp, formatGHS, type Pesewas } from "@/lib/money";
import { getRuleset } from "@/lib/tax";
import type { Ruleset } from "@/lib/tax/types";
import { calculatePaye, type PayeResult } from "./paye";
import { calculateSsnit, type SsnitResult } from "./ssnit";

export const FREQUENCIES = ["monthly", "annual"] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export interface SalaryInput {
  /** Basic salary for the given frequency, in pesewas. */
  basicSalary: Pesewas;
  frequency: Frequency;
  /** Taxable cash allowances for the given frequency, in pesewas. */
  allowances?: Pesewas;
  /** One-off bonus paid once in the year, in pesewas. */
  annualBonus?: Pesewas;
  rulesetId?: string;
}

export interface PeriodSummary {
  basicSalary: Pesewas;
  allowances: Pesewas;
  bonus: Pesewas;
  gross: Pesewas;
  ssnit: Pesewas;
  /** Chargeable income for PAYE (gross employment income less SSNIT relief), excluding bonus. */
  taxableIncome: Pesewas;
  paye: Pesewas;
  bonusTax: Pesewas;
  totalDeductions: Pesewas;
  net: Pesewas;
  /** (PAYE + bonus tax) / gross. */
  effectiveTaxRate: number;
  /** Total deductions / gross. */
  effectiveDeductionRate: number;
}

export interface BonusResult {
  bonus: Pesewas;
  /** Portion of the bonus eligible for the flat final tax. */
  flatRatePortion: Pesewas;
  flatRateBp: number;
  flatTax: Pesewas;
  /** Portion taxed with employment income at graduated rates. */
  excess: Pesewas;
  excessTax: Pesewas;
  totalTax: Pesewas;
}

export interface SalaryResult {
  ruleset: Pick<Ruleset, "id" | "label" | "taxYear" | "effectiveFrom" | "effectiveTo" | "status" | "notice" | "sources">;
  inputFrequency: Frequency;
  /** A regular month (no bonus). */
  monthly: PeriodSummary;
  /** Twelve regular months plus any bonus. */
  annual: PeriodSummary;
  ssnit: SsnitResult;
  paye: PayeResult;
  bonus: BonusResult | null;
  assumptions: string[];
  exclusions: string[];
}

function summarise(p: Omit<PeriodSummary, "gross" | "totalDeductions" | "net" | "effectiveTaxRate" | "effectiveDeductionRate">): PeriodSummary {
  const gross = p.basicSalary + p.allowances + p.bonus;
  const totalDeductions = p.ssnit + p.paye + p.bonusTax;
  return {
    ...p,
    gross,
    totalDeductions,
    net: gross - totalDeductions,
    effectiveTaxRate: gross === 0 ? 0 : (p.paye + p.bonusTax) / gross,
    effectiveDeductionRate: gross === 0 ? 0 : totalDeductions / gross,
  };
}

/** Estimate take-home pay for a resident employee in Ghana. Pure: same input, same output. */
export function calculateSalary(input: SalaryInput): SalaryResult {
  const ruleset = getRuleset(input.rulesetId);
  const allowances = input.allowances ?? 0;
  const bonusAmount = input.annualBonus ?? 0;
  for (const [name, value] of Object.entries({ basicSalary: input.basicSalary, allowances, annualBonus: bonusAmount })) {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer number of pesewas`);
  }

  // 1. Normalise to a month. PAYE is withheld monthly, so the engine works on a monthly basis.
  const isAnnual = input.frequency === "annual";
  const monthlyBasic = isAnnual ? divRoundHalfUp(input.basicSalary, 12) : input.basicSalary;
  const monthlyAllowances = isAnnual ? divRoundHalfUp(allowances, 12) : allowances;
  const annualBasic = isAnnual ? input.basicSalary : input.basicSalary * 12;
  const annualAllowances = isAnnual ? allowances : allowances * 12;

  // 2. SSNIT on basic salary, then SSNIT relief reduces chargeable income.
  const ssnit = calculateSsnit(monthlyBasic, ruleset.ssnit);
  const taxableIncome = monthlyBasic + monthlyAllowances - ssnit.contribution;

  // 3. PAYE on a regular month.
  const paye = calculatePaye(taxableIncome, ruleset.paye.monthlyBands);

  // 4. Bonus: capped share at a flat final rate; excess taxed with that month's pay.
  let bonus: BonusResult | null = null;
  if (bonusAmount > 0) {
    const flatRatePortion = Math.min(bonusAmount, applyRate(annualBasic, ruleset.bonus.capOfAnnualBasicBp));
    const excess = bonusAmount - flatRatePortion;
    const flatTax = applyRate(flatRatePortion, ruleset.bonus.flatRateBp);
    const excessTax = excess === 0 ? 0 : calculatePaye(taxableIncome + excess, ruleset.paye.monthlyBands).total - paye.total;
    bonus = { bonus: bonusAmount, flatRatePortion, flatRateBp: ruleset.bonus.flatRateBp, flatTax, excess, excessTax, totalTax: flatTax + excessTax };
  }

  const monthly = summarise({
    basicSalary: monthlyBasic,
    allowances: monthlyAllowances,
    bonus: 0,
    ssnit: ssnit.contribution,
    taxableIncome,
    paye: paye.total,
    bonusTax: 0,
  });
  const annual = summarise({
    basicSalary: annualBasic,
    allowances: annualAllowances,
    bonus: bonusAmount,
    ssnit: ssnit.contribution * 12,
    taxableIncome: taxableIncome * 12,
    paye: paye.total * 12,
    bonusTax: bonus?.totalTax ?? 0,
  });

  const { id, label, taxYear, effectiveFrom, effectiveTo, status, notice, sources } = ruleset;
  return {
    ruleset: { id, label, taxYear, effectiveFrom, effectiveTo, status, notice, sources },
    inputFrequency: input.frequency,
    monthly,
    annual,
    ssnit,
    paye,
    bonus,
    assumptions: buildAssumptions(ruleset, isAnnual),
    exclusions: EXCLUSIONS,
  };
}

function pct(bp: number): string {
  return `${bp / 100}%`;
}

function buildAssumptions(r: Ruleset, isAnnual: boolean): string[] {
  const list = [
    `Rates for ${r.label} (effective ${r.effectiveFrom} to ${r.effectiveTo}).`,
    "You are a resident individual in regular employment for the whole year; PAYE is worked out month by month using the resident monthly bands.",
    `Employee SSNIT is ${pct(r.ssnit.employeeRateBp)} of basic salary, capped at maximum insurable earnings of ${formatGHS(r.ssnit.maxInsurableMonthly)} a month, and is deducted before PAYE (SSNIT relief).`,
    "Allowances are treated as fully taxable cash allowances and are not part of the SSNIT base.",
    `A bonus up to ${pct(r.bonus.capOfAnnualBasicBp)} of annual basic salary is taxed at a flat ${pct(r.bonus.flatRateBp)} final tax; any excess is added to one month's pay and taxed at the graduated rates. The bonus is assumed to be paid in a single month.`,
    "Every amount is rounded half-up to the nearest pesewa; PAYE is summed across bands before rounding. Annual SSNIT and PAYE are 12 × the monthly amounts.",
  ];
  if (isAnnual) list.push("Your annual figures were divided by 12 (rounded to the pesewa) to get the monthly amounts PAYE and SSNIT are calculated on.");
  return list;
}

const EXCLUSIONS = [
  "Personal reliefs (marriage/responsibility, child education, aged dependant, disability, old age) — these would lower your PAYE.",
  "Voluntary (Tier 3) pension or provident fund contributions.",
  "Benefits in kind (vehicle, accommodation, etc.), overtime tax rules and non-cash allowances.",
  "Non-resident or casual worker tax rates.",
  "Employer-specific deductions such as loans, union dues, welfare or insurance.",
  "The employer's own SSNIT contribution, which is paid on top of your salary and does not reduce your take-home pay.",
];
