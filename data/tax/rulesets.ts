import type { Ruleset } from "@/lib/tax/types";

/**
 * Versioned Ghana statutory configuration.
 *
 * DO NOT edit a value here without a source. Money is in pesewas, rates in basis points.
 * See NEXT_STEPS.md for what still needs verifying against official GRA / SSNIT publications.
 */

// Resident monthly PAYE bands in force since 1 January 2024
// (GH₵490 @0%, 110 @5%, 130 @10%, 3,166.67 @17.5%, 16,000 @25%, 30,520 @30%, above 50,416.67 @35%).
const PAYE_BANDS_2024 = [
  { width: 49_000, rateBp: 0 },
  { width: 11_000, rateBp: 500 },
  { width: 13_000, rateBp: 1_000 },
  { width: 316_667, rateBp: 1_750 },
  { width: 1_600_000, rateBp: 2_500 },
  { width: 3_052_000, rateBp: 3_000 },
  { width: null, rateBp: 3_500 },
];

const COMMON = {
  status: "secondary-sources",
  ssnitEmployeeRateBp: 550,
  // Income Tax Act, 2015 (Act 896): bonus up to 15% of annual basic salary taxed at 5% final tax.
  bonus: { capOfAnnualBasicBp: 1_500, flatRateBp: 500 },
} as const;

export const RULESETS: Ruleset[] = [
  {
    id: "2026-jan-aug",
    label: "2026 (1 Jan – 31 Aug)",
    taxYear: 2026,
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-08-31",
    status: COMMON.status,
    notice:
      "The Income Tax (Amendment) Act, 2026 (Act 1178) changed the resident PAYE bands from 1 September 2026, raising the monthly tax-free band from GH₵490 to GH₵588. The full new band table has not yet been verified for this calculator, so PAYE for September 2026 onwards may differ from this estimate.",
    paye: { monthlyBands: PAYE_BANDS_2024 },
    ssnit: { employeeRateBp: COMMON.ssnitEmployeeRateBp, maxInsurableMonthly: 6_900_000 },
    bonus: COMMON.bonus,
    sources: [
      { label: "GRA PAYE monthly rates (in force from January 2024)", url: "https://gra.gov.gh/domestic-tax/tax-types/paye/" },
      { label: "SSNIT: maximum insurable earnings GH₵69,000 from 1 January 2026", url: "https://www.ssnit.org.gh/maximum-insurable-earning-increased/" },
      { label: "Income Tax Act, 2015 (Act 896) — bonus and SSNIT relief rules" },
    ],
  },
  {
    id: "2025",
    label: "2025",
    taxYear: 2025,
    effectiveFrom: "2025-01-01",
    effectiveTo: "2025-12-31",
    status: COMMON.status,
    paye: { monthlyBands: PAYE_BANDS_2024 },
    ssnit: { employeeRateBp: COMMON.ssnitEmployeeRateBp, maxInsurableMonthly: 6_100_000 },
    bonus: COMMON.bonus,
    sources: [
      { label: "GRA PAYE monthly rates (in force from January 2024)", url: "https://gra.gov.gh/domestic-tax/tax-types/paye/" },
      { label: "SSNIT: maximum insurable earnings GH₵61,000 for 2025", url: "https://www.ssnit.org.gh/" },
      { label: "Income Tax Act, 2015 (Act 896) — bonus and SSNIT relief rules" },
    ],
  },
];

export const DEFAULT_RULESET_ID = "2026-jan-aug";
