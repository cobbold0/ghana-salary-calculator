import Link from "next/link";
import { WorkedExample } from "@/components/salary/WorkedExample";
import { Article } from "@/components/site/Article";
import { pageMetadata } from "@/lib/site";

const path = "/gross-to-net";
const title = "Gross to Net Salary in Ghana: Step-by-Step";
export const metadata = pageMetadata({
  path,
  title,
  description: "Convert a gross salary to net salary in Ghana step by step: SSNIT, taxable income, PAYE bands and take-home pay, with a worked example and calculator.",
});

export default function Page() {
  return (
    <Article path={path} title={title} intro="Gross salary is what you earn before deductions. Net salary is what you keep. Here is how to get from one to the other.">
      <h2>Gross vs net salary</h2>
      <ul>
        <li>
          <strong>Gross salary</strong> — basic salary plus cash allowances (and any bonus), before anything is deducted. Job offers and contracts
          usually quote gross pay.
        </li>
        <li>
          <strong>Net salary</strong> — gross salary minus deductions. It is also called take-home pay.
        </li>
      </ul>

      <h2>The formula</h2>
      <ol>
        <li>
          <strong>SSNIT</strong> = 5.5% × basic salary (capped at the maximum insurable earnings)
        </li>
        <li>
          <strong>Taxable income</strong> = basic salary + taxable allowances − SSNIT
        </li>
        <li>
          <strong>PAYE</strong> = tax on each band of taxable income, added together
        </li>
        <li>
          <strong>Net salary</strong> = gross salary − SSNIT − PAYE
        </li>
      </ol>
      <WorkedExample basicCedis={8000} />

      <h2>Common mistakes</h2>
      <ul>
        <li>
          <strong>Applying one tax rate to the whole salary.</strong> PAYE is progressive: only the income inside each band is taxed at that
          band&apos;s rate.
        </li>
        <li>
          <strong>Charging SSNIT on allowances.</strong> SSNIT is based on basic salary only.
        </li>
        <li>
          <strong>Taxing income before SSNIT.</strong> Your SSNIT contribution is deducted first, which lowers your PAYE.
        </li>
        <li>
          <strong>Dividing annual tax by 12 incorrectly.</strong> Employers deduct PAYE monthly, so work out the monthly salary first.
        </li>
      </ul>

      <h2>Going the other way: net to gross</h2>
      <p>
        If you know the take-home pay you need, try different gross salaries in the calculator above until the estimated take-home pay matches. This
        is useful when negotiating — see our <Link href="/salary-guide">salary guide</Link>.
      </p>
    </Article>
  );
}
