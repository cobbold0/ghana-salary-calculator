# Ghana Salary Calculator

A fast, private, mobile-first calculator that estimates take-home pay in Ghana after SSNIT and PAYE, with a transparent breakdown and the tax rules used.

Built with Next.js (App Router, static rendering), TypeScript, Tailwind CSS and Zod. Calculations run entirely in the browser; salary values are never sent, stored or put in URLs.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit + integration tests |
| `npm run build` | Production build (all pages static) |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` before a production build — it drives canonical URLs, Open Graph, `sitemap.xml` and `robots.txt`. AdSense and Google Analytics variables are optional; with none set, no ad or analytics scripts load.

## Structure

```text
app/                    routes: calculator home, net-to-gross, salary comparison, 8 SEO/content pages, privacy, sitemap.ts, robots.ts
components/calculator/  SalaryCalculator, NetToGrossCalculator, SalaryComparison (client forms) + SalaryResults (breakdown, explanations)
components/salary/      config-driven content: PAYE band table, SSNIT facts, worked examples
components/site/        header, footer, Article layout, JSON-LD, AdSlot
data/tax/rulesets.ts    versioned statutory configuration (the only place rates live)
lib/tax/                ruleset schema (Zod) + registry
lib/calculations/       pure engine: paye.ts, ssnit.ts, salary.ts, net-to-gross.ts, compare.ts
lib/validation/         Zod schema for form input
lib/money.ts            pesewa parsing, rounding, GH₵ formatting
tests/                  engine, config, validation and calculator integration tests
```

## Calculation engine

`calculateSalary(input)` is a pure function over integer **pesewas**:

1. Annual input is divided by 12 (half-up to the pesewa) — PAYE is withheld monthly.
2. SSNIT = employee rate × basic salary, capped at maximum insurable earnings.
3. Taxable income = basic + taxable allowances − SSNIT.
4. PAYE = progressive monthly bands; band taxes are summed exactly, then rounded once.
5. Bonus: portion up to the configured share of annual basic salary at a flat final rate; any excess taxed at marginal rates on top of one month's pay.
6. Net = gross − SSNIT − PAYE (− bonus tax in the annual view). Annual SSNIT/PAYE = 12 × monthly; annual gross stays exactly as entered.

The result includes per-band PAYE detail, SSNIT base/cap, bonus split, effective rates, the ruleset used (id, dates, verification status, notice, sources), assumptions and exclusions.

### Net to gross

`netToGross(input)` binary-searches the smallest monthly basic salary whose forward-calculated take-home pay reaches the target. Monthly take-home pay never decreases and rises by at most one pesewa per pesewa of basic salary, so the result hits the target exactly (unless fixed allowances alone exceed it). Annual targets are split into 12 months, rounded up, so the annual take-home pay may exceed the target by up to 11 pesewas.

### Salary comparison

`compareOffers(a, b)` runs the forward engine on both packages under the same tax rules (offers may use different frequencies) and returns both results plus the annual (including bonuses) and regular-month take-home differences. The higher offer is decided on annual take-home pay.

### Rounding policy

Integer pesewas throughout; every deduction line is rounded half-up to the nearest pesewa exactly once. User input is parsed from the string (no float maths).

## Tax data and verification status

Rates live only in `data/tax/rulesets.ts`, validated by a Zod schema at load (bands ordered, single open top band, non-decreasing rates, valid dates). Each ruleset carries a `status`:

- `secondary-sources` — consistent across multiple secondary sources, **not** checked against official GRA/SSNIT publications. Shown to users on every result.
- `verified-official` — checked against an official publication.

Current rulesets: **2026 (1 Jan – 31 Aug)** (default) and **2025**, both `secondary-sources`. The Income Tax (Amendment) Act, 2026 (Act 1178) changed resident PAYE bands from 1 September 2026; those bands are not yet loaded (see `NEXT_STEPS.md`). The UI shows this notice.

### Adding or updating a tax year

1. Add a ruleset in `data/tax/rulesets.ts` with sources; set `status: "verified-official"` only after checking official publications.
2. Update `DEFAULT_RULESET_ID` if it should become the default.
3. Add tests with hand-worked expected values in `tests/`.
4. Content pages read rates from configuration; review prose for any year-specific wording.

## Monetization

`AdSlot` renders only when `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT` are set. It is labelled "Advertisement" and placed only in content areas below the calculator — never among inputs or results.

## Analytics

Google Analytics 4 loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (via `@next/third-parties`). Custom events go through `lib/analytics.ts`, whose types allow only non-monetary parameters:

| Event | Parameters |
| --- | --- |
| `calculator_opened` | — |
| `salary_period_selected` | `period` |
| `calculation_completed` (once per visit) | `period`, `has_allowances`, `has_bonus`, `tax_rules` |
| `net_to_gross_completed` (once per visit) | `period`, `has_allowances`, `tax_rules` |
| `comparison_completed` (once per visit) | `tax_rules` |

Salary values never appear in URLs or events; `tests/analytics.test.tsx` enforces this.

## Cookie consent

When GA or AdSense is configured, a banner asks for consent (Google Consent Mode v2, `lib/consent.ts`). Ads always show: `ad_storage` is granted by default so non-personalised ads work. `ad_user_data`, `ad_personalization` and `analytics_storage` stay denied until the visitor clicks “Accept”; “No thanks” also sets AdSense `requestNonPersonalizedAds`. The choice is stored in `localStorage` and can be changed from “Cookie settings” in the footer.

## Deployment

Any Next.js host (e.g. Vercel). No database, no server-side secrets, no API routes.
