import { describe, expect, it } from "vitest";
import { calculatePaye } from "@/lib/calculations/paye";
import { getRuleset } from "@/lib/tax";

const bands = getRuleset("2026-jan-aug").paye.monthlyBands;
const paye = (cedis: number) => calculatePaye(Math.round(cedis * 100), bands).total;

describe("PAYE (resident monthly bands, 2024–Aug 2026 table)", () => {
  it.each([
    [0, 0],
    [490, 0], // top of tax-free band
    [490.01, 0], // 0.0005 → rounds to 0
    [490.1, 0.01], // 0.005 → rounds half-up to 0.01
    [600, 5.5],
    [730, 18.5],
    [3_896.67, 572.67],
    [19_896.67, 4_572.67],
    [50_416.67, 13_728.67],
    [60_416.67, 17_228.67],
    [4_725, 779.75],
  ])("chargeable GH₵%d → PAYE GH₵%d", (chargeable, expected) => {
    expect(paye(chargeable)).toBe(Math.round(expected * 100));
  });

  it("exposes a per-band breakdown that explains the total", () => {
    const result = calculatePaye(472_500, bands);
    expect(result.bands).toHaveLength(7);
    expect(result.bands.map((b) => b.taxableInBand)).toEqual([49_000, 11_000, 13_000, 316_667, 82_833, 0, 0]);
    expect(result.bands.map((b) => b.tax)).toEqual([0, 550, 1_300, 55_417, 20_708, 0, 0]);
    expect(result.bands[6].to).toBeNull();
    const bandSum = result.bands.reduce((s, b) => s + b.tax, 0);
    expect(Math.abs(bandSum - result.total)).toBeLessThanOrEqual(result.bands.length);
  });

  it("is monotonic in income", () => {
    let previous = -1;
    for (let c = 0; c <= 6_000_000; c += 12_345) {
      const t = calculatePaye(c, bands).total;
      expect(t).toBeGreaterThanOrEqual(previous);
      previous = t;
    }
  });

  it("never exceeds the top marginal rate", () => {
    const c = 1_000_000_000;
    expect(calculatePaye(c, bands).total).toBeLessThan(c * 0.35);
  });
});
