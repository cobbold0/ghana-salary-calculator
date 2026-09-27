import { describe, expect, it } from "vitest";
import { applyRate, divRoundHalfUp, formatGHS, parseAmount } from "@/lib/money";

describe("parseAmount", () => {
  it.each([
    ["5000", 500_000],
    ["5000.5", 500_050],
    ["5000.05", 500_005],
    ["1,000.50", 100_050],
    [" 2500 ", 250_000],
    ["GH₵ 2,500", 250_000],
    ["0", 0],
    ["0.01", 1],
    ["1.", 100],
    // Values that float maths gets wrong (1.005 * 100 = 100.49999…)
    ["1.00", 100],
    ["0.29", 29],
  ])("parses %j as %i pesewas", (raw, expected) => {
    expect(parseAmount(raw)).toBe(expected);
  });

  it.each(["", "abc", "-5", "1.234", "1e5", ".5", "12a", "1.2.3", "Infinity", "NaN", "99999999999999999999"])("rejects %j", (raw) => {
    expect(parseAmount(raw)).toBeNull();
  });
});

describe("rounding", () => {
  it("rounds half up", () => {
    expect(divRoundHalfUp(5, 10)).toBe(1);
    expect(divRoundHalfUp(4, 10)).toBe(0);
    expect(divRoundHalfUp(15, 10)).toBe(2);
    expect(divRoundHalfUp(0, 10)).toBe(0);
  });

  it("applies basis-point rates to the nearest pesewa", () => {
    expect(applyRate(100, 550)).toBe(6); // 5.5 pesewas → 6
    expect(applyRate(100_009, 550)).toBe(5_500); // 5500.495 → 5500
    expect(applyRate(100_010, 550)).toBe(5_501); // 5500.55 → 5501
  });

  it("rejects negative inputs", () => {
    expect(() => divRoundHalfUp(-1, 10)).toThrow(RangeError);
  });
});

describe("formatGHS", () => {
  it("formats pesewas as Ghana cedis", () => {
    expect(formatGHS(1_500_000)).toBe("GH₵15,000.00");
    expect(formatGHS(5)).toBe("GH₵0.05");
  });
});
