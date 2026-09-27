import Link from "next/link";
import { SsnitFacts } from "@/components/salary/RatesTables";
import { Article } from "@/components/site/Article";
import { getRuleset } from "@/lib/tax";
import { formatGHS } from "@/lib/money";
import { pageMetadata } from "@/lib/site";

const path = "/ssnit-calculator";
const title = "SSNIT Calculator Ghana: Your Pension Contribution";
export const metadata = pageMetadata({
  path,
  title,
  description: "Estimate your SSNIT deduction in Ghana. Learn how the employee contribution on basic salary works, the maximum insurable earnings, and how SSNIT lowers PAYE.",
});

export default function Page() {
  const r = getRuleset();
  const rate = r.ssnit.employeeRateBp / 100;
  return (
    <Article
      path={path}
      title={title}
      intro={`SSNIT is Ghana's Social Security and National Insurance Trust. As an employee, ${rate}% of your basic salary is deducted every month towards your pension.`}
    >
      <h2>SSNIT at a glance ({r.label})</h2>
      <SsnitFacts />

      <h2>How the employee deduction is calculated</h2>
      <p>
        SSNIT = {rate}% × basic salary. For example, on a basic salary of {formatGHS(400_000)} a month the deduction is{" "}
        {formatGHS((400_000 * r.ssnit.employeeRateBp) / 10_000)}. Only basic salary counts — allowances and bonuses do not.
      </p>
      <p>
        If your basic salary is above the maximum insurable earnings ({formatGHS(r.ssnit.maxInsurableMonthly)} a month), the deduction is capped at{" "}
        {rate}% of that ceiling.
      </p>

      <h2>SSNIT lowers your income tax</h2>
      <p>
        Your SSNIT contribution is deducted from your income before PAYE is calculated, so part of every cedi you contribute would otherwise have
        been taxed. The calculator above applies this automatically. See <Link href="/paye-calculator">how PAYE is calculated</Link>.
      </p>

      <h2>The three-tier pension system</h2>
      <ul>
        <li>
          <strong>Tier 1</strong> — the basic national social security scheme managed by SSNIT.
        </li>
        <li>
          <strong>Tier 2</strong> — a mandatory occupational scheme managed by private trustees.
        </li>
        <li>
          <strong>Tier 3</strong> — voluntary personal or provident fund savings.
        </li>
      </ul>
      <p>
        Your employer also contributes on top of your salary. That contribution does not come out of your pay, so it does not change your take-home
        pay and is not shown in the calculator.
      </p>

      <h2>Check your contributions</h2>
      <p>
        Your payslip should show the SSNIT amount deducted each month. You can confirm your contribution record with SSNIT directly. If the
        deduction on your payslip is very different from {rate}% of your basic salary, ask your payroll team why.
      </p>
    </Article>
  );
}
