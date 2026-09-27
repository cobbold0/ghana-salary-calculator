import Link from "next/link";
import { PayeBandsTable } from "@/components/salary/RatesTables";
import { WorkedExample } from "@/components/salary/WorkedExample";
import { Article } from "@/components/site/Article";
import { getRuleset } from "@/lib/tax";
import { pageMetadata } from "@/lib/site";

const path = "/paye-calculator";
const title = "PAYE Calculator Ghana: Income Tax Bands Explained";
export const metadata = pageMetadata({
  path,
  title,
  description: "Estimate PAYE income tax on your Ghana salary. See the resident monthly tax bands, how PAYE is calculated after SSNIT, and a worked example.",
});

export default function Page() {
  const r = getRuleset();
  return (
    <Article
      path={path}
      title={title}
      intro="PAYE (Pay As You Earn) is the income tax your employer deducts from your salary each month and pays to the Ghana Revenue Authority (GRA)."
    >
      <h2>How PAYE works</h2>
      <p>
        PAYE is charged on <strong>chargeable income</strong>: your basic salary plus taxable allowances, minus your SSNIT contribution. The tax is
        progressive — income is split into bands and each band is taxed at its own rate. Earning more never reduces your take-home pay, because
        only the income above a threshold is taxed at the higher rate.
      </p>

      <h2>Monthly PAYE bands ({r.label})</h2>
      <PayeBandsTable />
      {r.notice && <p className="rounded-xl border border-notice-border bg-notice-bg p-4 text-sm">{r.notice}</p>}

      <h2>Worked example</h2>
      <WorkedExample basicCedis={5000} />

      <h2>Marginal vs effective tax rate</h2>
      <p>
        Your <strong>marginal rate</strong> is the rate on your last cedi of income — the band you are in. Your <strong>effective rate</strong> is
        total PAYE divided by gross pay. In the example above, the top slice is taxed at 25% but PAYE is a much smaller share of the salary.
      </p>

      <h2>What can lower your PAYE</h2>
      <ul>
        <li>Your SSNIT contribution, which is deducted before PAYE (included in the calculator).</li>
        <li>
          Personal reliefs you have claimed with the GRA, such as marriage/responsibility, child education or aged dependant relief (not included in
          the calculator).
        </li>
        <li>Voluntary Tier 3 pension contributions within the allowed limit (not included in the calculator).</li>
      </ul>

      <h2>Who this applies to</h2>
      <p>
        The bands above are for resident individuals in employment. Non-residents and some casual workers are taxed differently and are not covered
        by this calculator. For your exact tax position, speak to your employer&apos;s payroll team or the GRA. You can also read about{" "}
        <Link href="/ssnit-calculator">SSNIT</Link> and <Link href="/gross-to-net">gross to net pay</Link>.
      </p>
    </Article>
  );
}
