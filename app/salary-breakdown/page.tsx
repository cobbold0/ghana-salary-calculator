import Link from "next/link";
import { WorkedExample } from "@/components/salary/WorkedExample";
import { Article } from "@/components/site/Article";
import { pageMetadata } from "@/lib/site";

const path = "/salary-breakdown";
const title = "Salary Breakdown: How to Read a Ghana Payslip";
export const metadata = pageMetadata({
  path,
  title,
  description: "Understand every line on a Ghana payslip — basic salary, allowances, SSNIT, PAYE and other deductions — and see a full salary breakdown for your pay.",
});

export default function Page() {
  return (
    <Article path={path} title={title} intro="See where your money goes: a line-by-line guide to a typical Ghanaian payslip, and a breakdown of your own salary.">
      <h2>A typical payslip, line by line</h2>
      <h3>Earnings</h3>
      <ul>
        <li>
          <strong>Basic salary</strong> — your fixed pay. SSNIT is based on this figure.
        </li>
        <li>
          <strong>Allowances</strong> — transport, housing, fuel, utility or similar cash allowances. Usually taxable.
        </li>
        <li>
          <strong>Overtime and bonuses</strong> — variable pay, which can be taxed under special rules.
        </li>
        <li>
          <strong>Gross pay</strong> — the total of all earnings.
        </li>
      </ul>
      <h3>Statutory deductions</h3>
      <ul>
        <li>
          <strong>SSNIT</strong> — your employee pension contribution. <Link href="/ssnit-calculator">How SSNIT works</Link>.
        </li>
        <li>
          <strong>PAYE / income tax</strong> — tax on your income after SSNIT. <Link href="/paye-calculator">How PAYE works</Link>.
        </li>
      </ul>
      <h3>Other deductions</h3>
      <ul>
        <li>Voluntary pension (Tier 3) or provident fund.</li>
        <li>Loan or salary-advance repayments.</li>
        <li>Union dues, welfare, insurance or staff savings.</li>
      </ul>
      <h3>Net pay</h3>
      <p>Gross pay minus all deductions — the amount paid into your account.</p>

      <h2>Example breakdown</h2>
      <WorkedExample basicCedis={4500} allowancesCedis={500} />

      <h2>Checking your payslip against the calculator</h2>
      <ol>
        <li>Enter your basic salary and taxable allowances from the payslip into the calculator above.</li>
        <li>Compare SSNIT: it should be very close to 5.5% of basic salary.</li>
        <li>
          Compare PAYE. A lower figure on your payslip often means you have personal reliefs or voluntary pension contributions; a higher one can mean
          taxable benefits in kind or overtime.
        </li>
        <li>Anything else on your payslip is a non-statutory deduction specific to you.</li>
      </ol>
      <p>
        If something does not add up, your employer&apos;s payroll or HR team can explain it. The calculator gives an estimate and cannot see your
        employer&apos;s records.
      </p>
    </Article>
  );
}
