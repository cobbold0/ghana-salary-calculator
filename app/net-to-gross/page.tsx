import Link from "next/link";
import { NetToGrossCalculator } from "@/components/calculator/NetToGrossCalculator";
import { Article } from "@/components/site/Article";
import { netToGross } from "@/lib/calculations/net-to-gross";
import { formatGHS } from "@/lib/money";
import { pageMetadata } from "@/lib/site";

const path = "/net-to-gross";
const title = "Net to Gross Salary Calculator Ghana";
export const metadata = pageMetadata({
  path,
  title,
  description:
    "Work out the gross salary you need in Ghana for a target take-home pay, after SSNIT and PAYE. Useful for job offers and salary negotiations.",
});

export default function Page() {
  const example = netToGross({ targetNet: 500_000, frequency: "monthly" }).result.monthly;
  return (
    <Article
      path={path}
      title={title}
      intro="Know the take-home pay you need? Enter it below to see the gross salary that would deliver it after SSNIT and PAYE."
      calculator={<NetToGrossCalculator />}
    >
      <h2>How it works</h2>
      <p>
        There is no simple formula to reverse PAYE, because each slice of income is taxed at a different rate and SSNIT is deducted first. Instead,
        the calculator searches for the smallest basic salary whose estimated take-home pay — calculated exactly as in the{" "}
        <Link href="/">salary calculator</Link> — matches your target to the pesewa.
      </p>
      <p>
        For example, to take home {formatGHS(example.net)} a month you need a basic salary of <strong>{formatGHS(example.basicSalary)}</strong>
        : SSNIT of {formatGHS(example.ssnit)} and PAYE of {formatGHS(example.paye)} are deducted from it.
      </p>

      <h2>Allowances</h2>
      <p>
        If part of your package is paid as fixed cash allowances (transport, housing), enter them under &quot;Allowances &amp; tax year&quot;. The
        calculator keeps them fixed and works out the basic salary needed on top. Allowances are taxed but do not attract SSNIT, so the same
        take-home pay can need a slightly different gross salary depending on the split.
      </p>

      <h2>Using it in a negotiation</h2>
      <ul>
        <li>Start from your real monthly costs and savings goal to decide your target take-home pay.</li>
        <li>Ask for the gross figure this calculator gives, and get the basic/allowance split in writing.</li>
        <li>
          Remember the result is an estimate: personal reliefs, voluntary pension and other deductions will change it. See{" "}
          <Link href="/salary-guide">understanding salary offers</Link>.
        </li>
      </ul>
      <p>
        Want to check the calculation in the other direction? Read <Link href="/gross-to-net">gross to net salary</Link>.
      </p>
    </Article>
  );
}
