import type { Pesewas } from "@/lib/money";
import { divRoundHalfUp } from "@/lib/money";
import { calculateSalary, type Frequency, type SalaryResult } from "./salary";

export interface NetToGrossInput {
  /** Desired take-home pay for the given frequency, in pesewas. */
  targetNet: Pesewas;
  frequency: Frequency;
  /** Fixed taxable allowances for the given frequency, in pesewas. */
  allowances?: Pesewas;
  rulesetId?: string;
}

export interface NetToGrossResult {
  /** Smallest monthly basic salary whose take-home pay reaches the target. */
  monthlyBasic: Pesewas;
  /** Full forward calculation for that basic salary (monthly input). */
  result: SalaryResult;
}

/**
 * Find the basic salary needed for a target take-home pay.
 *
 * Works on the monthly figure, like PAYE. Monthly take-home pay never decreases as basic salary rises
 * and rises by at most one pesewa per pesewa of basic, so a binary search finds the smallest basic
 * salary whose take-home pay equals the target exactly (or exceeds it only when allowances alone
 * already cover it). An annual target is split into 12 months, rounded up so the year is covered.
 */
export function netToGross(input: NetToGrossInput): NetToGrossResult {
  const allowances = input.allowances ?? 0;
  for (const [name, value] of Object.entries({ targetNet: input.targetNet, allowances })) {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative integer number of pesewas`);
  }
  const isAnnual = input.frequency === "annual";
  const target = isAnnual ? Math.ceil(input.targetNet / 12) : input.targetNet;
  const monthly = (basicSalary: Pesewas) =>
    calculateSalary({ basicSalary, allowances: isAnnual ? divRoundHalfUp(allowances, 12) : allowances, frequency: "monthly", rulesetId: input.rulesetId });

  // Take-home pay is always well above half of basic salary, so 2 × target is a safe upper bound.
  let lo = 0;
  let hi = 2 * target;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (monthly(mid).monthly.net >= target) hi = mid;
    else lo = mid + 1;
  }
  const result = monthly(lo);
  if (result.monthly.net < target) throw new RangeError("Target take-home pay is out of range");
  return { monthlyBasic: lo, result };
}
