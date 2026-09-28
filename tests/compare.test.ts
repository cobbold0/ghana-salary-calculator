import { describe, expect, it } from "vitest";
import { compareOffers } from "@/lib/calculations/compare";

const ghs = (cedis: number) => Math.round(cedis * 100);

describe("compareOffers", () => {
  it("shows that the basic/allowance split changes take-home pay for the same gross", () => {
    const c = compareOffers({ basicSalary: ghs(6_000), frequency: "monthly" }, { basicSalary: ghs(5_000), allowances: ghs(1_000), frequency: "monthly" });
    expect(c.a.monthly).toMatchObject({ gross: ghs(6_000), ssnit: ghs(330), paye: ghs(1_016), net: ghs(4_654) });
    expect(c.b.monthly).toMatchObject({ gross: ghs(6_000), ssnit: ghs(275), paye: ghs(1_029.75), net: ghs(4_695.25) });
    expect(c.monthlyNetDifference).toBe(ghs(41.25));
    expect(c.annualNetDifference).toBe(ghs(495));
    expect(c.higher).toBe("b");
  });

  it("compares offers quoted in different frequencies", () => {
    const c = compareOffers({ basicSalary: ghs(60_000), frequency: "annual" }, { basicSalary: ghs(5_000), frequency: "monthly" });
    expect(c.annualNetDifference).toBe(0);
    expect(c.monthlyNetDifference).toBe(0);
    expect(c.higher).toBeNull();
  });

  it("uses annual take-home including bonus to pick the higher offer, even if the regular month is lower", () => {
    const c = compareOffers({ basicSalary: ghs(5_000), annualBonus: ghs(9_000), frequency: "monthly" }, { basicSalary: ghs(5_200), frequency: "monthly" });
    expect(c.monthlyNetDifference).toBeGreaterThan(0); // B higher each month
    expect(c.annualNetDifference).toBeLessThan(0); // A higher over the year
    expect(c.higher).toBe("a");
  });

  it("applies the same tax year to both offers", () => {
    const c = compareOffers(
      { basicSalary: ghs(100_000), frequency: "monthly", rulesetId: "2025" },
      { basicSalary: ghs(100_000), frequency: "monthly", rulesetId: "2025" },
    );
    expect(c.a.ruleset.id).toBe("2025");
    expect(c.b.monthly.ssnit).toBe(ghs(3_355));
  });

  it("refuses to compare under different tax rules", () => {
    expect(() =>
      compareOffers({ basicSalary: 1, frequency: "monthly", rulesetId: "2025" }, { basicSalary: 1, frequency: "monthly", rulesetId: "2026-jan-aug" }),
    ).toThrow(/same tax rules/);
  });
});
