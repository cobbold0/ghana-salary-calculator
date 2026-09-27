# Ghana Salary Calculator — Technical Specification

## Stack

Next.js, TypeScript, React, Tailwind CSS, Zod.

## Architecture

Keep calculation logic independent from UI. Suggested structure (adjust if a better one exists):

```text
app/          routes (page.tsx, salary-calculator/, ghana-salary-calculator/, take-home-pay/, gross-to-net/, paye-calculator/, ssnit-calculator/, salary-breakdown/, salary-guide/)
components/   calculator/, salary/, ui/
lib/          calculations/, tax/, validation/, formatting/
data/         tax/, statutory/
types/
```

## Calculation Engine

Pure functions. Flow: Input → normalize salary → determine period → determine taxable income → calculate statutory deductions → calculate PAYE → calculate net income → return breakdown. UI components must not contain tax logic.

## Versioned Tax Configuration

Statutory values must be versioned (conceptually: `TaxYear { year, effectiveFrom, effectiveTo, ssnitRules, payeRules, allowances, otherRules }`). Never bury rates inside React components.

## Rounding

Define one consistent rounding policy and document it. Avoid floating-point errors; use integer minor units or a controlled decimal strategy.

## Salary Input

Support monthly and annual (future: weekly, daily). Validate numeric input, positive values, reasonable maximum, decimal handling.

## Allowances

Allow configurable income components. Separate taxable, non-taxable, statutory, discretionary. Only implement classifications that can be verified.

## PAYE

Structured tax bands/configuration. The result should expose enough information to explain the calculation.

## SSNIT

Implement using the applicable verified rules. Expose employee contribution, applicable base, relevant assumptions. Do not assume every compensation component is treated identically.

## Result Model

`gross, taxableIncome, ssnit, paye, otherDeductions, totalDeductions, net, effectiveTaxRate, period, taxYear, assumptions[]` (may evolve).

## Validation

Schema validation with useful errors (salary required, must be positive, unsupported frequency, invalid allowance).

## Formatting

Ghanaian currency, locale-aware, e.g. `GH₵ 15,000.00`.

## Interactive Behavior

Results update quickly; client-side calculation; no unnecessary server requests.

## SEO Pages

Server-rendered/static. User-entered salary values must not become indexable URLs.

## Analytics

If added, only anonymous events (`calculator_opened`, `calculation_completed`, `salary_period_selected`). Never send salary values.

## Tests

Unit tests: tax calculations, SSNIT, PAYE, salary conversion, rounding, boundaries, zero/invalid input, annual/monthly conversion, different tax years. Integration tests for the main calculator flow.

## Security

No secrets in source control. Validate server inputs. Do not expose private configuration.

## Performance

Load quickly on mobile networks; avoid unnecessary client dependencies.

## Deployment

Inexpensive mainstream Next.js-compatible hosting. Provide `.env.example` only if environment variables are needed.
