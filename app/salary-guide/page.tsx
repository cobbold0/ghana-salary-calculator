import Link from "next/link";
import { Article } from "@/components/site/Article";
import { pageMetadata } from "@/lib/site";

const path = "/salary-guide";
const title = "Ghana Salary Guide: Understanding Pay and Job Offers";
export const metadata = pageMetadata({
  path,
  title,
  description: "A plain-English guide to salaries in Ghana: gross vs net pay, monthly vs annual salary, allowances, bonuses, and how to compare job offers.",
});

export default function Page() {
  return (
    <Article
      path={path}
      title={title}
      intro="The key salary terms to understand before you accept a job offer, ask for a raise or plan your budget."
      calculator={null}
    >
      <h2>Gross salary vs net salary</h2>
      <p>
        <strong>Gross</strong> is the headline number before deductions; <strong>net</strong> is what you receive after SSNIT and PAYE. Offers are
        usually quoted gross, so always convert to net before comparing with your costs. Read <Link href="/gross-to-net">gross to net salary</Link>.
      </p>

      <h2>Monthly vs annual salary</h2>
      <p>
        Most Ghanaian employers pay monthly, but some offers — especially from international companies — quote an annual figure. Divide an annual
        salary by 12 to get the monthly equivalent. Check whether the annual figure includes a bonus or a 13th month: if it does, your regular monthly
        pay will be lower than the annual figure divided by 12.
      </p>

      <h2>Basic salary vs allowances</h2>
      <p>
        A package is often split into basic salary and allowances. The split matters:
      </p>
      <ul>
        <li>SSNIT is calculated on basic salary only, so a higher basic means a larger pension contribution now and potentially a larger pension later.</li>
        <li>Allowances are usually taxable, but they do not count towards SSNIT.</li>
        <li>Some benefits, such as future pay rises, may be calculated on basic salary only — ask how raises are applied.</li>
      </ul>

      <h2>Bonuses</h2>
      <p>
        A bonus up to 15% of annual basic salary is taxed at a flat 5%. Anything above that is taxed at your normal PAYE rates in the month it is
        paid, so a large bonus can be taxed more heavily than you expect.
      </p>

      <h2>Comparing two job offers</h2>
      <ol>
        <li>Put both offers on the same basis — monthly or annual.</li>
        <li>Enter each into the calculator and note the estimated take-home pay.</li>
        <li>Add the value of benefits that save you money (transport, meals, medical cover, housing).</li>
        <li>Consider pension: a higher basic salary means higher SSNIT contributions.</li>
        <li>Look beyond pay: growth, job security, commute and working hours matter too.</li>
      </ol>

      <h2>Negotiating salary</h2>
      <ul>
        <li>
          Decide the take-home pay you need, then use the <Link href="/net-to-gross">net-to-gross calculator</Link> to find the gross salary that
          delivers it.
        </li>
        <li>Ask for the breakdown of basic salary and allowances in writing.</li>
        <li>Clarify when salary reviews happen and whether bonuses are guaranteed or discretionary.</li>
      </ul>
      <p>
        This guide is general information, not financial or legal advice.{" "}
        <Link href="/">Try the salary calculator</Link> to see the numbers for your situation.
      </p>
    </Article>
  );
}
