import { z } from "zod";

/**
 * All money values in a ruleset are integer pesewas (GH₵ 1 = 100 pesewas).
 * All rates are integer basis points (1% = 100 bp, 17.5% = 1750 bp).
 */

export const verificationStatusSchema = z.enum([
  /** Checked against an official GRA / SSNIT / gazette publication. */
  "verified-official",
  /** Consistent across several secondary sources, not yet checked against an official publication. */
  "secondary-sources",
]);

export const payeBandSchema = z.object({
  /** Width of the band in pesewas per month; `null` means "everything above". */
  width: z.number().int().positive().nullable(),
  rateBp: z.number().int().min(0).max(10_000),
});

export const sourceSchema = z.object({ label: z.string().min(1), url: z.url().optional() });

export const rulesetSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    taxYear: z.number().int(),
    effectiveFrom: z.iso.date(),
    effectiveTo: z.iso.date(),
    status: verificationStatusSchema,
    /** Shown prominently whenever this ruleset is used (e.g. it has been superseded). */
    notice: z.string().optional(),
    paye: z.object({
      /** Monthly bands for resident individuals, applied in order. */
      monthlyBands: z.array(payeBandSchema).min(1),
    }),
    ssnit: z.object({
      /** Employee share of the SSNIT contribution, applied to basic salary. */
      employeeRateBp: z.number().int().min(0).max(10_000),
      /** Maximum insurable earnings per month; basic salary above this is not subject to SSNIT. */
      maxInsurableMonthly: z.number().int().positive(),
    }),
    bonus: z.object({
      /** Bonus up to this share of annual basic salary is taxed at `flatRateBp` (final tax). */
      capOfAnnualBasicBp: z.number().int().min(0).max(10_000),
      flatRateBp: z.number().int().min(0).max(10_000),
    }),
    sources: z.array(sourceSchema).min(1),
  })
  .superRefine((r, ctx) => {
    const bands = r.paye.monthlyBands;
    bands.forEach((b, i) => {
      const isLast = i === bands.length - 1;
      if (isLast !== (b.width === null)) {
        ctx.addIssue({ code: "custom", message: "Only the last PAYE band may (and must) be open-ended", path: ["paye", "monthlyBands", i] });
      }
      if (i > 0 && b.rateBp < bands[i - 1].rateBp) {
        ctx.addIssue({ code: "custom", message: "PAYE rates must not decrease", path: ["paye", "monthlyBands", i] });
      }
    });
    if (r.effectiveFrom > r.effectiveTo) {
      ctx.addIssue({ code: "custom", message: "effectiveFrom must be on or before effectiveTo", path: ["effectiveFrom"] });
    }
  });

export type VerificationStatus = z.infer<typeof verificationStatusSchema>;
export type PayeBand = z.infer<typeof payeBandSchema>;
export type Ruleset = z.infer<typeof rulesetSchema>;
