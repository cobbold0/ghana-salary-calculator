import { describe, expect, it } from "vitest";
import { DEFAULT_RULESET_ID, getRuleset, listRulesets } from "@/lib/tax";
import { rulesetSchema } from "@/lib/tax/types";

describe("tax configuration", () => {
  it("every ruleset passes schema validation", () => {
    for (const r of listRulesets()) expect(rulesetSchema.safeParse(r).success).toBe(true);
  });

  it("ids are unique and the default exists", () => {
    const ids = listRulesets().map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getRuleset().id).toBe(DEFAULT_RULESET_ID);
  });

  it("does not claim official verification for values checked only against secondary sources", () => {
    for (const r of listRulesets()) expect(r.status).toBe("secondary-sources");
  });

  it("flags that the 2026 January–August bands were superseded by Act 1178", () => {
    expect(getRuleset("2026-jan-aug").notice).toMatch(/Act 1178/);
  });

  it("throws for an unknown ruleset", () => {
    expect(() => getRuleset("1999")).toThrow(/Unknown tax ruleset/);
  });

  const base = getRuleset();
  it("rejects a band table whose last band is not open-ended", () => {
    const bad = { ...base, paye: { monthlyBands: [{ width: 100, rateBp: 0 }] } };
    expect(rulesetSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an open-ended band before the last band", () => {
    const bad = { ...base, paye: { monthlyBands: [{ width: null, rateBp: 0 }, { width: null, rateBp: 500 }] } };
    expect(rulesetSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects decreasing rates", () => {
    const bad = { ...base, paye: { monthlyBands: [{ width: 100, rateBp: 500 }, { width: null, rateBp: 0 }] } };
    expect(rulesetSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an effective range that ends before it starts", () => {
    expect(rulesetSchema.safeParse({ ...base, effectiveTo: "2025-01-01" }).success).toBe(false);
  });
});
