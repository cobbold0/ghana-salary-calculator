import Link from "next/link";
import { WorkedExample } from "@/components/salary/WorkedExample";
import { Article } from "@/components/site/Article";
import { pageMetadata } from "@/lib/site";

const path = "/take-home-pay";
const title = "Take-Home Pay in Ghana: What You Actually Receive";
export const metadata = pageMetadata({
  path,
  title,
  description: "What take-home pay means in Ghana, which deductions reduce it, and a worked example from gross salary to net pay. Estimate yours with our free calculator.",
});

export default function Page() {
  return (
    <Article
      path={path}
      title={title}
      intro="Take-home pay (net pay) is the amount paid into your account after your employer deducts SSNIT and PAYE income tax."
    >
      <h2>What reduces your take-home pay</h2>
      <p>For most employees in Ghana, two statutory deductions come out of every salary:</p>
      <ul>
        <li>
          <strong>SSNIT</strong> — your 5.5% pension contribution, calculated on basic salary. <Link href="/ssnit-calculator">SSNIT explained</Link>.
        </li>
        <li>
          <strong>PAYE</strong> — income tax, charged in bands on your income after SSNIT. <Link href="/paye-calculator">PAYE explained</Link>.
        </li>
      </ul>
      <p>
        Your payslip may also show deductions that are not required by law — loan repayments, union dues, welfare, insurance or voluntary pension
        contributions. These are specific to you and your employer, so the calculator does not include them.
      </p>

      <h2>A worked example</h2>
      <WorkedExample basicCedis={3000} />
      <p>
        Notice that PAYE is not simply a percentage of your salary: the first slice of taxable income is tax-free and each further slice is taxed at a
        higher rate. That is why your effective tax rate is lower than your top rate.
      </p>

      <h2>Why take-home pay is more useful than gross salary</h2>
      <p>
        Rent, transport, school fees and savings all come out of take-home pay, so it is the figure to budget with and to compare job offers on. Two
        offers with the same gross salary can give different take-home pay if one pays more as basic salary (higher SSNIT) and the other more as
        allowances. See <Link href="/salary-guide">understanding salary offers</Link>.
      </p>

      <h2>Allowances and take-home pay</h2>
      <p>
        Cash allowances increase your gross pay and your PAYE, but not your SSNIT contribution, because SSNIT is based on basic salary only.
      </p>
      <WorkedExample basicCedis={3000} allowancesCedis={1000} />
    </Article>
  );
}
