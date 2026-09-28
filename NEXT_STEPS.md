# Ghana Salary Calculator — Next Steps

## Owner must do

- **Verify and supply the PAYE bands under the Income Tax (Amendment) Act, 2026 (Act 1178), effective 1 September 2026.** Only two facts could be confirmed from secondary sources: the monthly tax-free band rose from GH₵490 to GH₵588 (annual GH₵5,880 → GH₵7,056), and the top 35% rate applies above GH₵600,000 a year. The full monthly band table (widths of the 5%, 10%, 17.5%, 25% and 30% bands) could not be verified — GRA's website was not reachable from the build environment. Provide the official GRA monthly table so a `2026-sep-dec` ruleset can be added and made the default. Until then the calculator defaults to the Jan–Aug 2026 rules and shows a notice.
- **Verify the Jan–Aug 2026 and 2025 PAYE bands** in `data/tax/rulesets.ts` against the official GRA publication (monthly: GH₵490 @0%, 110 @5%, 130 @10%, 3,166.67 @17.5%, 16,000 @25%, 30,520 @30%, above 50,416.67 @35%). They are currently sourced from multiple consistent secondary sources.
- **Verify SSNIT values**: employee rate 5.5% of basic salary; maximum insurable earnings GH₵69,000/month for 2026 and GH₵61,000/month for 2025 (from news reports of SSNIT announcements; ssnit.org.gh was not reachable).
- **Verify the bonus rule**: bonus up to 15% of annual basic salary taxed at 5% final tax, excess taxed with employment income at graduated rates.
- Once verified, change each ruleset's `status` to `"verified-official"` (the "not yet checked" wording then disappears from results).
- Register a production domain and set `NEXT_PUBLIC_SITE_URL` in the hosting environment (canonical URLs, sitemap and robots currently fall back to `http://localhost:3000`).
- Create a hosting account (e.g. Vercel) and connect this repository.
- Apply for Google AdSense when there is traffic/content; then set `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_SLOT`, add `public/ads.txt`, and decide on a consent (CMP) solution if serving users in regions that require one.
- Review the privacy page and disclaimer wording for legal/business suitability.
- Create a Google Analytics 4 property and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the hosting environment. Optionally mark `calculation_completed` as a key event in GA. GA uses cookies, so include it in the consent (CMP) decision above.
- Submit the sitemap to Google Search Console once the domain is live.

## Optional improvements

- Add the Sep–Dec 2026 ruleset (Act 1178) once verified, and a date-aware default.
- Personal reliefs (marriage/responsibility, child education, aged dependant, disability, old age) as optional inputs, once rules are verified.
- Voluntary Tier 3 contributions and their tax deductibility limit.
- Salary comparison (two offers side by side).
- Detailed payslip calculator (benefits in kind, overtime).
- Employer view (employer SSNIT, total cost of employment).
- Downloadable/printable salary breakdown.
- Open Graph images per page.
- End-to-end browser tests (Playwright) in CI.
- A `/ghana-salary-calculator-2026` page only after 2026 values are fully verified.

## Completed

- Next.js 16 + TypeScript + Tailwind + Zod app scaffolded; all pages statically rendered.
- Pure calculation engine in integer pesewas: monthly/annual input, SSNIT with cap, taxable income, progressive PAYE with per-band breakdown, bonus flat-rate/excess rule, net pay, effective rates, assumptions and exclusions.
- Versioned, schema-validated tax configuration (2026 Jan–Aug, 2025) with verification status, sources and a superseded notice.
- Zod input validation with field-level errors (required, zero, negative, malformed, too many decimals, max amount, frequency, tax year).
- Mobile-first calculator UI: live results, monthly/annual view toggle, progressive disclosure for allowances/bonus/tax year, visual breakdown bar, PAYE/SSNIT/bonus explanations, rules and limitations notice. Checked at 390px and 1280px, light and dark, no horizontal overflow, no console errors.
- SEO pages: `/`, `/salary-calculator`, `/ghana-salary-calculator`, `/take-home-pay`, `/gross-to-net`, `/paye-calculator`, `/ssnit-calculator`, `/salary-breakdown`, `/salary-guide`, plus `/privacy`; unique titles, descriptions, canonicals, Open Graph, one H1 each; WebApplication and BreadcrumbList JSON-LD (no ratings/reviews); worked examples and rate tables generated from the engine/config.
- `sitemap.xml` and `robots.txt`.
- Net-to-gross calculator at `/net-to-gross`: exact binary-search solver on the same engine, fixed allowances, monthly/annual targets, full breakdown; linked from gross-to-net and salary guide pages.
- Google Analytics 4 (off until a measurement ID is set) with anonymous events only; test proves no salary amounts are sent.
- Ad slot component (off by default), placed only in content areas away from the calculator.
- 114 tests (net-to-gross solver and UI, analytics privacy, engine, rounding, boundaries, SSNIT cap, bonuses, annual/monthly, tax-year changes, config validation, input validation, calculator integration) — passing. Lint, typecheck and production build passing.
