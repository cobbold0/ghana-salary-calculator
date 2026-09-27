import { z } from "zod";
import { FREQUENCIES, type SalaryInput } from "@/lib/calculations/salary";
import { parseAmount } from "@/lib/money";
import { DEFAULT_RULESET_ID, listRulesets } from "@/lib/tax";

/** GH₵ 100 million per field, in pesewas — far above any realistic salary, well inside safe integer maths. */
export const MAX_AMOUNT = 10_000_000_000;

function amount(label: string, { required }: { required: boolean }) {
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
      if (value > MAX_AMOUNT) {
        ctx.addIssue({ code: "custom", message: `${label} must be GH₵100,000,000 or less` });
        return z.NEVER;
      }
      if (required && value === 0) {
        ctx.addIssue({ code: "custom", message: `${label} must be greater than zero` });
        return z.NEVER;
      }
      return value;
    });
}

/** Raw calculator form values (strings, as typed) → validated engine input. */
export const salaryFormSchema = z
  .object({
    basicSalary: amount("Basic salary", { required: true }),
    frequency: z.enum(FREQUENCIES, { error: "Unsupported salary frequency" }),
    allowances: amount("Allowances", { required: false }).prefault(""),
    annualBonus: amount("Bonus", { required: false }).prefault(""),
    rulesetId: z
      .string()
      .default(DEFAULT_RULESET_ID)
      .refine((id) => listRulesets().some((r) => r.id === id), "Unsupported tax year"),
  })
  .transform((v): SalaryInput => v);

export type SalaryFormValues = z.input<typeof salaryFormSchema>;
export type SalaryFormErrors = Partial<Record<keyof SalaryFormValues, string>>;

export function parseSalaryForm(values: SalaryFormValues): { ok: true; input: SalaryInput } | { ok: false; errors: SalaryFormErrors } {
  const result = salaryFormSchema.safeParse(values);
  if (result.success) return { ok: true, input: result.data };
  const errors: SalaryFormErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof SalaryFormValues;
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}
