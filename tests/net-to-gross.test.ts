import { describe, expect, it } from "vitest";
import { netToGross } from "@/lib/calculations/net-to-gross";
import { calculateSalary } from "@/lib/calculations/salary";

const ghs = (cedis: number) => Math.round(cedis * 100);

describe("netToGross", () => {
  it("reverses the GH₵5,000 example exactly", () => {
    const r = netToGross({ targetNet: ghs(3_945.25), frequency: "monthly" });
    expect(r.monthlyBasic).toBe(ghs(5_000));
    expect(r.result.monthly.net).toBe(ghs(3_945.25));
  });

  it("works above the SSNIT ceiling and respects the tax year", () => {
    expect(netToGross({ targetNet: ghs(66_450.42), frequency: "monthly", rulesetId: "2026-jan-aug" }).monthlyBasic).toBe(ghs(100_000));
    expect(netToGross({ targetNet: ghs(66_736.42), frequency: "monthly", rulesetId: "2025" }).monthlyBasic).toBe(ghs(100_000));
  });

  it("finds the smallest basic salary that hits the target to the pesewa", () => {
    for (const target of [1, 463_05, 490_00, 600_00, 3_896_67, 12_345_67, 1_000_000_00, 5_000_000_00]) {
      const { monthlyBasic, result } = netToGross({ targetNet: target, frequency: "monthly" });
      expect(result.monthly.net).toBe(target);
      if (monthlyBasic > 0) {
        expect(calculateSalary({ basicSalary: monthlyBasic - 1, frequency: "monthly" }).monthly.net).toBeLessThan(target);
      }
    }
  });

  it("round-trips with the forward calculator for many salaries", () => {
    for (let basic = 0; basic <= 20_000_000; basic += 123_457) {
      const net = calculateSalary({ basicSalary: basic, frequency: "monthly" }).monthly.net;
      const { monthlyBasic } = netToGross({ targetNet: net, frequency: "monthly" });
      expect(monthlyBasic).toBeLessThanOrEqual(basic);
      expect(calculateSalary({ basicSalary: monthlyBasic, frequency: "monthly" }).monthly.net).toBe(net);
    }
  });

  it("keeps allowances fixed and solves for basic salary", () => {
    const r = netToGross({ targetNet: ghs(4_695.25), allowances: ghs(1_000), frequency: "monthly" });
    expect(r.monthlyBasic).toBe(ghs(5_000));
    expect(r.result.monthly).toMatchObject({ allowances: ghs(1_000), gross: ghs(6_000), net: ghs(4_695.25) });
  });

  it("returns zero basic when allowances alone cover the target", () => {
    const r = netToGross({ targetNet: ghs(100), allowances: ghs(1_000), frequency: "monthly" });
    expect(r.monthlyBasic).toBe(0);
    expect(r.result.monthly.net).toBeGreaterThanOrEqual(ghs(100));
  });

  it("handles a zero target", () => {
    expect(netToGross({ targetNet: 0, frequency: "monthly" }).monthlyBasic).toBe(0);
  });

  it("splits an annual target into months, never falling short of the year", () => {
    const r = netToGross({ targetNet: ghs(47_343), frequency: "annual" });
    expect(r.monthlyBasic).toBe(ghs(5_000));
    expect(r.result.annual.net).toBe(ghs(47_343));

    const odd = netToGross({ targetNet: ghs(50_000), frequency: "annual" });
    expect(odd.result.annual.net).toBeGreaterThanOrEqual(ghs(50_000));
    expect(odd.result.annual.net - ghs(50_000)).toBeLessThan(12);
  });

  it("solves the maximum accepted target", () => {
    const r = netToGross({ targetNet: 1_000_000_000, frequency: "monthly" });
    expect(r.result.monthly.net).toBe(1_000_000_000);
  });

  it.each([{ targetNet: -1 }, { targetNet: 1.5 }, { targetNet: 100, allowances: -1 }])("rejects %j", (bad) => {
    expect(() => netToGross({ frequency: "monthly", ...bad })).toThrow(RangeError);
  });
});
