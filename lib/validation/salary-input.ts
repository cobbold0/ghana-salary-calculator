import { z } from "zod";
import type { NetToGrossInput } from "@/lib/calculations/net-to-gross";
import { FREQUENCIES, type SalaryInput } from "@/lib/calculations/salary";
import { parseAmount } from "@/lib/money";
import { DEFAULT_RULESET_ID, listRulesets } from "@/lib/tax";

/** GH₵ 100 million per field, in pesewas — far above any realistic salary, well inside safe integer maths. */
export const MAX_AMOUNT = 10_000_000_000;

function amount(label: string, { required, max = MAX_AMOUNT }: { required: boolean; max?: number }) {
  return z
    .string({ error: `${label} must be a number` })
    .transform((raw, ctx) => {
      if (raw.trim() === "") {
        if (required) ctx.addIssue({ code: "custom", message: `${label} is required` });
        return 0;
      }
      if (/^\s*-/.test(raw)) {
        ctx.addIssue({ code: "custom", message: `${label} cannot be negative` });
        return z.NEVER;
      }
      const value = parseAmount(raw);
      if (value === null) {
        ctx.addIssue({ code: "custom", message: `${label} must be a number with at most 2 decimal places` });
        return z.NEVER;
      }
      if (value > max) {
        ctx.addIssue({ code: "custom", message: `${label} must be GH₵${(max / 100).toLocaleString("en-GH")} or less` });
        return z.NEVER;
      }
      if (required && value === 0) {
        ctx.addIssue({ code: "custom", message: `${label} must be greater than zero` });
        return z.NEVER;
      }
      return value;
    });
}

const frequency = z.enum(FREQUENCIES, { error: "Unsupported salary frequency" });
const rulesetId = z
  .string()
  .default(DEFAULT_RULESET_ID)
  .refine((id) => listRulesets().some((r) => r.id === id), "Unsupported tax year");

/** Raw calculator form values (strings, as typed) → validated engine input. */
export const salaryFormSchema = z
  .object({
    basicSalary: amount("Basic salary", { required: true }),
    frequency,
    allowances: amount("Allowances", { required: false }).prefault(""),
    annualBonus: amount("Bonus", { required: false }).prefault(""),
    rulesetId,
  })
  .transform((v): SalaryInput => v);

/** Raw net-to-gross form values → validated solver input. Target capped at GH₵10 million. */
export const netToGrossFormSchema = z
  .object({
    targetNet: amount("Take-home pay", { required: true, max: 1_000_000_000 }),
    frequency,
    allowances: amount("Allowances", { required: false }).prefault(""),
    rulesetId,
  })
  .transform((v): NetToGrossInput => v);

export type SalaryFormValues = z.input<typeof salaryFormSchema>;
export type SalaryFormErrors = Partial<Record<keyof SalaryFormValues, string>>;

export type NetToGrossFormValues = z.input<typeof netToGrossFormSchema>;
export type NetToGrossFormErrors = Partial<Record<keyof NetToGrossFormValues, string>>;

type Parsed<I, E> = { ok: true; input: I } | { ok: false; errors: E };

function parseWith<I, V>(schema: z.ZodType<I, V>, values: V): Parsed<I, Partial<Record<keyof V, string>>> {
  const result = schema.safeParse(values);
  if (result.success) return { ok: true, input: result.data };
  const errors: Partial<Record<keyof V, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof V;
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}

export function parseSalaryForm(values: SalaryFormValues): Parsed<SalaryInput, SalaryFormErrors> {
  return parseWith(salaryFormSchema, values);
}

export function parseNetToGrossForm(values: NetToGrossFormValues): Parsed<NetToGrossInput, NetToGrossFormErrors> {
  return parseWith(netToGrossFormSchema, values);
}
