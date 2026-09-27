import { applyRate, type Pesewas } from "@/lib/money";
import type { Ruleset } from "@/lib/tax/types";

export interface SsnitResult {
  /** Monthly basic salary the contribution is based on. */
  basicSalary: Pesewas;
  /** Basic salary after applying the maximum insurable earnings cap. */
  insurableEarnings: Pesewas;
  capped: boolean;
  rateBp: number;
  /** Employee contribution deducted from pay. */
  contribution: Pesewas;
}

/** Monthly employee SSNIT contribution on basic salary. */
export function calculateSsnit(monthlyBasic: Pesewas, rules: Ruleset["ssnit"]): SsnitResult {
  const insurableEarnings = Math.min(monthlyBasic, rules.maxInsurableMonthly);
  return {
    basicSalary: monthlyBasic,
    insurableEarnings,
    capped: monthlyBasic > rules.maxInsurableMonthly,
    rateBp: rules.employeeRateBp,
    contribution: applyRate(insurableEarnings, rules.employeeRateBp),
  };
}
