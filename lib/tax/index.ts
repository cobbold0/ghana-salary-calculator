import { DEFAULT_RULESET_ID, RULESETS } from "@/data/tax/rulesets";
import { rulesetSchema, type Ruleset } from "./types";

// Validate configuration once at module load so a bad edit fails loudly in tests and at build time.
const rulesets: Ruleset[] = RULESETS.map((r) => rulesetSchema.parse(r));

export function listRulesets(): Ruleset[] {
  return rulesets;
}

export function getRuleset(id: string = DEFAULT_RULESET_ID): Ruleset {
  const ruleset = rulesets.find((r) => r.id === id);
  if (!ruleset) throw new Error(`Unknown tax ruleset: ${id}`);
  return ruleset;
}

export { DEFAULT_RULESET_ID };
export type { Ruleset, PayeBand, VerificationStatus } from "./types";
