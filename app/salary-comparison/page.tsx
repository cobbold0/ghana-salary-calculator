import Link from "next/link";
import { SalaryComparison } from "@/components/calculator/SalaryComparison";
import { Article } from "@/components/site/Article";
import { compareOffers } from "@/lib/calculations/compare";
import { formatGHS } from "@/lib/money";
import { pageMetadata } from "@/lib/site";

const path = "/salary-comparison";
const title = "Compare Two Salary Offers in Ghana";
export const metadata = pageMetadata({
  path,
  title,
  description:
    "Compare two job offers side by side in Ghana: gross pay, SSNIT, PAYE and estimated take-home pay, including allowances and bonuses.",
});

export default function Page() {
  // Same gross salary, different split between basic salary and allowances.
  const example = compareOffers(
    { basicSalary: 600_000, frequency: "monthly" },
    { basicSalary: 500_000, allowances: 100_000, frequency: "monthly" },
  );
  const { a, b } = { a: example.a.monthly, b: example.b.monthly };
  return (
    <Article
      path={path}
      title={title}
      intro="Enter two salary packages to see which leaves you with more take-home pay after SSNIT and PAYE — per month and per year."
      calculator={<SalaryComparison />}
    >
      <h2>Why the headline salary is not enough</h2>
      <p>
        Two offers with the same gross salary can leave you with different take-home pay. What matters is how the package is split between basic
        salary, allowances and bonuses, because each is treated differently:
      </p>
      <ul>
        <li>SSNIT is charged on basic salary only, so a higher basic salary means a higher deduction — and a larger pension contribution.</li>
        <li>Cash allowances are taxed under PAYE but do not attract SSNIT.</li>
        <li>Bonuses up to 15% of annual basic salary are taxed at a flat 5%; anything above that is taxed at normal rates.</li>
      </ul>

      <h2>Example: same gross, different split</h2>
      <p>
        Offer A pays {formatGHS(a.gross)} a month, all as basic salary. Offer B pays the same {formatGHS(b.gross)}, split into{" "}
        {formatGHS(b.basicSalary)} basic salary and {formatGHS(b.allowances)} allowances.
      </p>
      <ul>
        <li>
          Offer A: SSNIT {formatGHS(a.ssnit)}, PAYE {formatGHS(a.paye)}, take-home <strong>{formatGHS(a.net)}</strong>
        </li>
        <li>
          Offer B: SSNIT {formatGHS(b.ssnit)}, PAYE {formatGHS(b.paye)}, take-home <strong>{formatGHS(b.net)}</strong>
        </li>
      </ul>
      <p>
        Offer B gives {formatGHS(example.monthlyNetDifference)} more cash each month, but Offer A puts {formatGHS(a.ssnit - b.ssnit)} more into your
        SSNIT pension. Neither is simply &quot;better&quot; — it depends on what you value.
      </p>

      <h2>A checklist for comparing offers</h2>
      <ol>
        <li>Put both offers in — monthly or annual is fine; the calculator converts them.</li>
        <li>Compare annual take-home pay, which includes bonuses, and a regular month, which does not.</li>
        <li>Ask whether bonuses are guaranteed or depend on performance. Leave out anything that is not guaranteed.</li>
        <li>Add the value of benefits that save you money: medical cover, transport, meals, housing, training.</li>
        <li>Consider growth, job security, commute and working hours — they are part of the package too.</li>
      </ol>
      <p>
        Know the take-home pay you need? Use the <Link href="/net-to-gross">net-to-gross calculator</Link> to find the gross salary to ask for, and
        read our <Link href="/salary-guide">salary guide</Link> for negotiation basics.
      </p>
    </Article>
  );
}
