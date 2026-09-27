/**
 * Money helpers. The engine works exclusively in integer pesewas (GH₵ 1 = 100 pesewas).
 *
 * Rounding policy: every displayed amount (each deduction line) is rounded once,
 * half-up, to the nearest pesewa. Band-level PAYE is summed exactly before rounding.
 */

export type Pesewas = number;

/** Round the non-negative fraction `numerator / denominator` half-up to an integer. */
export function divRoundHalfUp(numerator: number, denominator: number): number {
  if (numerator < 0 || denominator <= 0) throw new RangeError("divRoundHalfUp expects non-negative inputs");
  return Math.floor((2 * numerator + denominator) / (2 * denominator));
}

/** Apply a rate in basis points to an amount in pesewas, rounding half-up to the pesewa. */
export function applyRate(amount: Pesewas, rateBp: number): Pesewas {
  return divRoundHalfUp(amount * rateBp, 10_000);
}

const AMOUNT_PATTERN = /^\d+(\.\d{0,2})?$/;

/**
 * Parse a user-typed GH₵ amount ("15,000.50", " 1200 ") into pesewas without floating-point maths.
 * Returns `null` for anything that is not a non-negative amount with at most two decimals.
 */
export function parseAmount(input: string): Pesewas | null {
  const cleaned = input.trim().replace(/,/g, "").replace(/^(GH₵|GHS|GHC)\s*/i, "");
  if (!AMOUNT_PATTERN.test(cleaned)) return null;
  const [cedis, fraction = ""] = cleaned.split(".");
  const value = Number(cedis) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(value) ? value : null;
}

const formatter = new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" });

export function formatGHS(amount: Pesewas): string {
  return formatter.format(amount / 100);
}

/** Format a ratio (0–1) as a percentage with one decimal place. */
export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`;
}
