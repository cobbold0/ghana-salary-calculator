# Ghana Salary Calculator — Product Specification

## Product Goal

Build a fast and trustworthy salary calculator for Ghana.

The primary experience: **Enter salary → select salary details → calculate → understand take-home pay.**

The calculator should help users understand how gross income becomes estimated net income after applicable deductions.

## Target Users

Employees, job seekers, graduates, people comparing job offers, freelancers moving into employment, employers, HR professionals, people negotiating salaries.

## Core Calculator

The calculator should accept:

- Gross salary
- Salary frequency
- Employee/employment context where relevant
- Allowances where applicable
- Bonuses where applicable
- Other configurable income components

The MVP should not overwhelm users with every possible payroll scenario. Use progressive disclosure for advanced inputs.

## Main Result

- **Gross Salary** — the salary before deductions.
- **Estimated Deductions** — show relevant deductions separately (SSNIT, PAYE, other statutory deductions where applicable).
- **Estimated Net Salary** — the amount remaining after applicable deductions. Use wording such as *Estimated take-home pay* rather than presenting the result as an official payroll statement.

## Breakdown

```text
Gross salary
- SSNIT
- PAYE
- Other deductions
------------------
Estimated net salary
```

Users should be able to understand where their money went.

## Monthly and Annual Views

Support monthly and annual salary. Users should be able to switch between views. If a user enters an annual salary, calculate the equivalent monthly amount appropriately.

## Salary Comparison (future)

Allow users to compare two salary packages (gross, allowances, estimated tax, estimated net). Not required for the initial MVP.

## Salary Negotiation (future SEO/content)

Help users understand gross salary, net salary, taxable income, allowances and annual compensation. Do not provide individualized financial advice.

## Public Pages

`/`, `/salary-calculator`, `/ghana-salary-calculator`, `/take-home-pay`, `/gross-to-net`, `/paye-calculator`, `/ssnit-calculator`, `/salary-breakdown`, `/salary-guide`.

Pages should contain genuinely useful information.

## Content

Gross vs net salary; how PAYE works; what SSNIT means; how take-home pay is calculated; how to read a payslip; monthly vs annual salary; salary negotiation basics. All current statutory information must be verified before publication.

## No Account Requirement

Users should be able to calculate salary without registration.

## Privacy

Salary calculations should preferably remain client-side. Do not collect names, phone numbers, employer information, or other personal data unless required.

## Monetization

Free calculator supported primarily through advertising. Future: salary comparison, advanced payslip tools, premium calculators, employer payroll tools, affiliate services. Do not cripple the free calculator.

## Out of Scope

Full payroll software, HR management, accounting platform, tax filing system, banking application, investment platform, recruitment platform, loan application, financial advisory service.

## Product Principle

The user should trust the calculator because the calculation is transparent. Show the assumptions instead of hiding them.
