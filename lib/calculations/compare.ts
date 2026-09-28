import { calculateSalary, type SalaryInput, type SalaryResult } from "./salary";

export interface OfferComparison {
  a: SalaryResult;
  b: SalaryResult;
  /** Offer B minus offer A, annual take-home pay including bonuses, in pesewas. */
  annualNetDifference: number;
  /** Offer B minus offer A, take-home pay in a regular month (no bonus), in pesewas. */
  monthlyNetDifference: number;
  /** The offer with more annual take-home pay, or `null` if equal. */
  higher: "a" | "b" | null;
}

/** Compare two salary packages under the same tax rules. Offers may use different pay frequencies. */
export function compareOffers(a: SalaryInput, b: SalaryInput): OfferComparison {
  if ((a.rulesetId ?? null) !== (b.rulesetId ?? null)) throw new Error("Offers must be compared under the same tax rules");
  const ra = calculateSalary(a);
  const rb = calculateSalary(b);
  const annualNetDifference = rb.annual.net - ra.annual.net;
  return {
    a: ra,
    b: rb,
    annualNetDifference,
    monthlyNetDifference: rb.monthly.net - ra.monthly.net,
    higher: annualNetDifference > 0 ? "b" : annualNetDifference < 0 ? "a" : null,
  };
}
