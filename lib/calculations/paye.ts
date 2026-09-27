import { divRoundHalfUp, type Pesewas } from "@/lib/money";
import type { PayeBand } from "@/lib/tax/types";

export interface PayeBandResult {
  from: Pesewas;
  /** Upper bound of the band, or `null` for the open-ended top band. */
  to: Pesewas | null;
  rateBp: number;
  taxableInBand: Pesewas;
  /** Tax in this band, rounded half-up to the pesewa (for display). */
  tax: Pesewas;
}

export interface PayeResult {
  chargeableIncome: Pesewas;
  /** Sum of exact band taxes, rounded once half-up to the pesewa. */
  total: Pesewas;
  bands: PayeBandResult[];
}

/** Progressive PAYE on a month's chargeable income. */
export function calculatePaye(chargeableIncome: Pesewas, bands: PayeBand[]): PayeResult {
  let from = 0;
  let exactTotal = 0; // pesewas × basis points, kept as an integer
  const results = bands.map((band) => {
    const to = band.width === null ? null : from + band.width;
    const taxableInBand = Math.max(0, Math.min(chargeableIncome, to ?? Infinity) - from);
    const exact = taxableInBand * band.rateBp;
    exactTotal += exact;
    const result = { from, to, rateBp: band.rateBp, taxableInBand, tax: divRoundHalfUp(exact, 10_000) };
    from = to ?? from;
    return result;
  });
  return { chargeableIncome, total: divRoundHalfUp(exactTotal, 10_000), bands: results };
}
