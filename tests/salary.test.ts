import { describe, expect, it } from "vitest";
import { calculateSalary } from "@/lib/calculations/salary";
import { calculateSsnit } from "@/lib/calculations/ssnit";
import { getRuleset } from "@/lib/tax";

const ghs = (cedis: number) => Math.round(cedis * 100);

describe("calculateSalary — monthly input", () => {
  it("GH₵5,000 basic: SSNIT 275, PAYE 779.75, net 3,945.25", () => {
    const r = calculateSalary({ basicSalary: ghs(5_000), frequency: "monthly" });
    expect(r.monthly).toMatchObject({
      gross: ghs(5_000),
      ssnit: ghs(275),
      taxableIncome: ghs(4_725),
      paye: ghs(779.75),
      totalDeductions: ghs(1_054.75),
      net: ghs(3_945.25),
    });
    expect(r.monthly.effectiveTaxRate).toBeCloseTo(0.15595, 5);
    expect(r.annual).toMatchObject({ gross: ghs(60_000), ssnit: ghs(3_300), paye: ghs(9_357), net: ghs(47_343) });
  });

  it("low salary within the tax-free band pays only SSNIT", () => {
    const r = calculateSalary({ basicSalary: ghs(490), frequency: "monthly" });
    expect(r.monthly).toMatchObject({ ssnit: ghs(26.95), paye: 0, net: ghs(463.05) });
  });

  it("zero salary produces zero everything without dividing by zero", () => {
    const r = calculateSalary({ basicSalary: 0, frequency: "monthly" });
    expect(r.monthly).toMatchObject({ gross: 0, net: 0, totalDeductions: 0, effectiveTaxRate: 0, effectiveDeductionRate: 0 });
  });

  it("allowances are taxed but not part of the SSNIT base", () => {
    const r = calculateSalary({ basicSalary: ghs(5_000), allowances: ghs(1_000), frequency: "monthly" });
    expect(r.monthly).toMatchObject({ gross: ghs(6_000), ssnit: ghs(275), taxableIncome: ghs(5_725), paye: ghs(1_029.75), net: ghs(4_695.25) });
  });

  it("net + deductions always equals gross", () => {
    for (const basic of [1, 99, 490, 1_234.56, 5_000, 25_000, 69_000, 250_000]) {
      const r = calculateSalary({ basicSalary: ghs(basic), allowances: ghs(basic / 3), annualBonus: ghs(basic), frequency: "monthly" });
      for (const p of [r.monthly, r.annual]) expect(p.net + p.totalDeductions).toBe(p.gross);
    }
  });
});

describe("SSNIT", () => {
  const rules = getRuleset("2026-jan-aug").ssnit;

  it("is 5.5% of basic salary", () => {
    expect(calculateSsnit(ghs(10_000), rules)).toMatchObject({ contribution: ghs(550), capped: false, insurableEarnings: ghs(10_000) });
  });

  it("is not capped exactly at maximum insurable earnings", () => {
    expect(calculateSsnit(ghs(69_000), rules)).toMatchObject({ contribution: ghs(3_795), capped: false });
  });

  it("is capped above maximum insurable earnings", () => {
    expect(calculateSsnit(ghs(69_000.01), rules)).toMatchObject({ contribution: ghs(3_795), capped: true, insurableEarnings: ghs(69_000) });
  });

  it("rounds half-up to the pesewa", () => {
    expect(calculateSsnit(ghs(1_000.09), rules).contribution).toBe(ghs(55)); // 55.00495
    expect(calculateSsnit(ghs(1_000.1), rules).contribution).toBe(ghs(55.01)); // 55.0055
    expect(calculateSsnit(1, rules).contribution).toBe(0); // 0.055 pesewa
  });
});

describe("tax-year configuration changes", () => {
  it("2026 uses the GH₵69,000 SSNIT ceiling, 2025 uses GH₵61,000", () => {
    const y2026 = calculateSalary({ basicSalary: ghs(100_000), frequency: "monthly", rulesetId: "2026-jan-aug" });
    const y2025 = calculateSalary({ basicSalary: ghs(100_000), frequency: "monthly", rulesetId: "2025" });
    expect(y2026.monthly).toMatchObject({ ssnit: ghs(3_795), paye: ghs(29_754.58), net: ghs(66_450.42) });
    expect(y2025.monthly).toMatchObject({ ssnit: ghs(3_355), paye: ghs(29_908.58), net: ghs(66_736.42) });
    expect(y2026.ruleset.taxYear).toBe(2026);
    expect(y2025.ruleset.taxYear).toBe(2025);
  });

  it("gives identical results across years when below both SSNIT ceilings", () => {
    const a = calculateSalary({ basicSalary: ghs(8_000), frequency: "monthly", rulesetId: "2026-jan-aug" });
    const b = calculateSalary({ basicSalary: ghs(8_000), frequency: "monthly", rulesetId: "2025" });
    expect(a.monthly).toEqual(b.monthly);
  });

  it("defaults to the latest ruleset and surfaces its notice", () => {
    const r = calculateSalary({ basicSalary: ghs(1_000), frequency: "monthly" });
    expect(r.ruleset.id).toBe("2026-jan-aug");
    expect(r.ruleset.notice).toBeTruthy();
    expect(r.assumptions[0]).toContain("2026");
  });

  it("throws for unknown rulesets", () => {
    expect(() => calculateSalary({ basicSalary: 1, frequency: "monthly", rulesetId: "nope" })).toThrow();
  });
});

describe("annual input", () => {
  it("GH₵60,000 a year equals GH₵5,000 a month", () => {
    const annual = calculateSalary({ basicSalary: ghs(60_000), frequency: "annual" });
    const monthly = calculateSalary({ basicSalary: ghs(5_000), frequency: "monthly" });
    expect(annual.monthly).toEqual(monthly.monthly);
    expect(annual.annual).toEqual(monthly.annual);
    expect(annual.inputFrequency).toBe("annual");
  });

  it("keeps the entered annual gross exact when it is not divisible by 12", () => {
    const r = calculateSalary({ basicSalary: ghs(100_000), frequency: "annual" });
    expect(r.monthly.basicSalary).toBe(ghs(8_333.33));
    expect(r.annual.gross).toBe(ghs(100_000));
    expect(r.annual.ssnit).toBe(r.monthly.ssnit * 12);
    expect(r.annual.paye).toBe(r.monthly.paye * 12);
    expect(r.assumptions.some((a) => a.includes("divided by 12"))).toBe(true);
  });

  it("converts annual allowances to monthly", () => {
    const r = calculateSalary({ basicSalary: ghs(60_000), allowances: ghs(12_000), frequency: "annual" });
    expect(r.monthly.allowances).toBe(ghs(1_000));
    expect(r.annual.allowances).toBe(ghs(12_000));
  });
});

describe("bonus", () => {
  it("is taxed at 5% up to 15% of annual basic salary", () => {
    const r = calculateSalary({ basicSalary: ghs(5_000), annualBonus: ghs(6_000), frequency: "monthly" });
    expect(r.bonus).toMatchObject({ flatRatePortion: ghs(6_000), flatTax: ghs(300), excess: 0, excessTax: 0, totalTax: ghs(300) });
  });

  it("exactly at the 15% cap has no excess", () => {
    const r = calculateSalary({ basicSalary: ghs(5_000), annualBonus: ghs(9_000), frequency: "monthly" });
    expect(r.bonus).toMatchObject({ flatRatePortion: ghs(9_000), excess: 0, totalTax: ghs(450) });
  });

  it("taxes the excess over the cap at the marginal rates of that month", () => {
    const r = calculateSalary({ basicSalary: ghs(5_000), annualBonus: ghs(10_000), frequency: "monthly" });
    expect(r.bonus).toMatchObject({ flatRatePortion: ghs(9_000), flatTax: ghs(450), excess: ghs(1_000), excessTax: ghs(250), totalTax: ghs(700) });
    expect(r.annual).toMatchObject({ gross: ghs(70_000), bonus: ghs(10_000), bonusTax: ghs(700), net: ghs(56_643) });
    // A regular month is unaffected by the bonus.
    expect(r.monthly.bonus).toBe(0);
    expect(r.monthly.net).toBe(ghs(3_945.25));
  });

  it("is absent when zero", () => {
    expect(calculateSalary({ basicSalary: ghs(5_000), annualBonus: 0, frequency: "monthly" }).bonus).toBeNull();
  });
});

describe("engine input guards", () => {
  it.each([
    { basicSalary: -1 },
    { basicSalary: 1.5 },
    { basicSalary: Number.NaN },
    { basicSalary: 100, allowances: -5 },
    { basicSalary: 100, annualBonus: Number.POSITIVE_INFINITY },
  ])("rejects %j", (bad) => {
    expect(() => calculateSalary({ frequency: "monthly", ...bad })).toThrow(RangeError);
  });

  it("handles the maximum accepted amounts without losing precision", () => {
    const max = 10_000_000_000;
    const r = calculateSalary({ basicSalary: max, allowances: max, annualBonus: max, frequency: "monthly" });
    expect(Number.isSafeInteger(r.annual.net)).toBe(true);
    expect(r.annual.net + r.annual.totalDeductions).toBe(r.annual.gross);
  });
});
