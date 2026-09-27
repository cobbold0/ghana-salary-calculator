import { describe, expect, it } from "vitest";
import { parseSalaryForm } from "@/lib/validation/salary-input";

const valid = { basicSalary: "5,000", frequency: "monthly" as const };

describe("parseSalaryForm", () => {
  it("accepts a valid form and converts to pesewas", () => {
    expect(parseSalaryForm({ ...valid, allowances: "250.5", annualBonus: "" })).toEqual({
      ok: true,
      input: { basicSalary: 500_000, frequency: "monthly", allowances: 25_050, annualBonus: 0, rulesetId: "2026-jan-aug" },
    });
  });

  it.each([
    ["", "Basic salary is required"],
    ["   ", "Basic salary is required"],
    ["0", "Basic salary must be greater than zero"],
    ["-100", "Basic salary cannot be negative"],
    ["abc", "Basic salary must be a number with at most 2 decimal places"],
    ["100.123", "Basic salary must be a number with at most 2 decimal places"],
    ["100000001", "Basic salary must be GH₵100,000,000 or less"],
  ])("basic salary %j → %s", (basicSalary, message) => {
    expect(parseSalaryForm({ ...valid, basicSalary })).toEqual({ ok: false, errors: { basicSalary: message } });
  });

  it("allows an allowance of zero but rejects invalid allowances", () => {
    expect(parseSalaryForm({ ...valid, allowances: "0" }).ok).toBe(true);
    expect(parseSalaryForm({ ...valid, allowances: "12x" })).toMatchObject({ ok: false, errors: { allowances: expect.stringMatching(/Allowances/) } });
  });

  it("rejects unsupported frequencies", () => {
    // @ts-expect-error — deliberately invalid
    expect(parseSalaryForm({ ...valid, frequency: "weekly" })).toEqual({ ok: false, errors: { frequency: "Unsupported salary frequency" } });
  });

  it("rejects unknown tax years", () => {
    expect(parseSalaryForm({ ...valid, rulesetId: "1990" })).toEqual({ ok: false, errors: { rulesetId: "Unsupported tax year" } });
  });

  it("reports every invalid field at once", () => {
    const r = parseSalaryForm({ basicSalary: "", frequency: "monthly", allowances: "-1", annualBonus: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["allowances", "annualBonus", "basicSalary"]);
  });
});
