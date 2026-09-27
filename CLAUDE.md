@AGENTS.md

# Ghana Salary Calculator — Claude Code Instructions

## Mission

You are the lead software engineer responsible for building a production-ready Ghana Salary Calculator for employees, job seekers, employers, and anyone who wants to estimate Ghanaian take-home pay.

Work autonomously. Read all project context files before coding:

- `CLAUDE.md`
- `PRODUCT.md`
- `TECHNICAL_SPEC.md`
- `MONETIZATION.md`
- `SEO.md`
- `NEXT_STEPS.md`

Then inspect the existing repository. Do not wait for approval for normal engineering decisions.

Only ask the owner when a decision genuinely requires human action, including:

- credentials
- domain/DNS
- external accounts
- paid services
- legal/business decisions
- information that cannot reasonably be verified

If an owner action is required, continue everything else and document it in `NEXT_STEPS.md`.

## Product Priorities

1. Correct calculations
2. Transparent assumptions
3. Excellent mobile UX
4. Easy salary input
5. Clear breakdown of deductions
6. Reliability
7. SEO
8. Performance
9. Monetization

Calculation correctness is more important than visual complexity.

## Financial Accuracy

This application deals with money.

Never invent current Ghana tax rates, SSNIT rules, levies, thresholds, reliefs, or other statutory values. Rates and thresholds must be represented as versioned/configurable data.

Clearly display:

- applicable year
- assumptions
- deductions included
- limitations

If current official values cannot be verified, do not pretend they are current. Avoid presenting estimates as guaranteed payroll results.

## UX

A user should be able to enter a salary and understand the result immediately. Keep the main calculator simple.

Avoid:

- unnecessary registration
- excessive animations
- complicated forms
- deceptive UI
- aggressive advertising
- unnecessary data collection

## Privacy

- Do not require personal information.
- Salary calculations should work without an account.
- Do not store salary values unless necessary.
- Do not send salary information to analytics providers.
- Never commit secrets.

## Engineering

Prefer Next.js, TypeScript, React, Tailwind CSS, Zod, strongly typed calculation models, pure calculation functions and versioned configuration. Keep financial calculation logic separate from UI.

## Testing

Calculation logic must have comprehensive tests. Test different salary levels, zero values, boundaries, deductions, allowances, bonuses, annual/monthly conversions, tax thresholds, SSNIT, malformed input, rounding, and configuration/version changes.

Run lint, type checking, tests and the production build. Fix failures before completion.

## SEO

SEO is a major acquisition channel. Build useful public pages around: Ghana salary calculator, net salary, gross salary, PAYE, SSNIT, take-home salary, salary breakdown. Do not create thin pages merely for keywords.

## Monetization

The initial business model is primarily advertising. Ads must never interfere with calculator inputs or results. Do not make advertisements resemble calculator controls. Do not force users to click ads.

## Git

Use Git throughout development. Before finishing: inspect `git status`, inspect the diff, remove accidental files, ensure no secrets are committed, commit meaningful work, push when possible.

## Documentation

Keep `README.md` and `NEXT_STEPS.md` accurate. `NEXT_STEPS.md` must contain:

- **Owner must do** — only actions requiring Augustine.
- **Optional improvements** — future improvements.
- **Completed** — only verified completed work.

## Definition of Done

The MVP should provide: salary input, salary frequency handling, gross salary calculation, applicable deductions, PAYE calculation, SSNIT calculation where applicable, net/take-home salary, clear breakdown, annual/monthly views, assumptions and applicable-year information, mobile-first UI, SEO pages, sitemap, robots, tests, production build, README, NEXT_STEPS.

Perform a final review for calculation correctness, edge cases, UX, accessibility, SEO, performance, security and monetization placement.
