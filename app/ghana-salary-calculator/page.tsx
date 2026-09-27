import Link from "next/link";
import { PayeBandsTable, SsnitFacts } from "@/components/salary/RatesTables";
import { Article } from "@/components/site/Article";
import { getRuleset, listRulesets } from "@/lib/tax";
import { pageMetadata } from "@/lib/site";

const path = "/ghana-salary-calculator";
const title = "Ghana Salary Calculator: Tax Rules, Rates and Method";
export const metadata = pageMetadata({
  path,
  title,
  description: "The PAYE bands, SSNIT rates and bonus rules behind our Ghana salary calculator, the tax year they apply to, and exactly how take-home pay is estimated.",
});

export default function Page() {
  const current = getRuleset();
  return (
    <Article
      path={path}
      title={title}
      intro="Everything the calculator uses — rates, thresholds, tax year and rounding — so you can check the estimate yourself."
    >
      <h2>Which rules are used</h2>
      <p>
        The calculator uses the <strong>{current.label}</strong> rules by default, effective {current.effectiveFrom} to {current.effectiveTo}.
      </p>
      {current.notice && (
        <p className="rounded-xl border border-notice-border bg-notice-bg p-4 text-sm">
          <strong>Important:</strong> {current.notice}
        </p>
      )}
      <p>
        These values come from published secondary sources and have not yet been checked against official GRA and SSNIT publications. We will
        update them — and say so here — once they have been.
      </p>

      <h2>PAYE bands</h2>
      <p>
        PAYE is worked out on monthly chargeable income for resident employees. Each slice of income is taxed at the rate for its band. See the{" "}
        <Link href="/paye-calculator">PAYE calculator</Link> for a full explanation.
      </p>
      <PayeBandsTable />

      <h2>SSNIT</h2>
      <SsnitFacts />
      <p>
        The employee contribution is deducted from basic salary before PAYE is calculated, which lowers your taxable income.{" "}
        <Link href="/ssnit-calculator">More about SSNIT</Link>.
      </p>

      <h2>Bonuses</h2>
      <p>
        A bonus up to {current.bonus.capOfAnnualBasicBp / 100}% of annual basic salary is taxed at a flat {current.bonus.flatRateBp / 100}% as a final tax. Anything above that limit is added to that month&apos;s pay
        and taxed at the normal PAYE rates.
      </p>

      <h2>Step by step</h2>
      <ol>
        <li>If you entered an annual salary, divide it by 12 to get the monthly amount.</li>
        <li>SSNIT = {current.ssnit.employeeRateBp / 100}% × basic salary, with basic salary capped at the maximum insurable earnings.</li>
        <li>Taxable income = basic salary + taxable allowances − SSNIT.</li>
        <li>PAYE = the sum of the tax on each band of taxable income.</li>
        <li>Take-home pay = gross salary − SSNIT − PAYE.</li>
        <li>Annual figures = 12 regular months, plus the bonus and the tax on it.</li>
      </ol>

      <h2>Rounding</h2>
      <p>
        All calculations use whole pesewas to avoid rounding errors. Each deduction is rounded half-up to the nearest pesewa, and PAYE is added up
        across bands before it is rounded. Your employer&apos;s payroll software may round slightly differently.
      </p>

      <h2>Not included</h2>
      <ul>
        <li>Personal reliefs such as marriage/responsibility, child education, aged dependant, disability and old-age relief.</li>
        <li>Voluntary (Tier 3) pension contributions.</li>
        <li>Benefits in kind, overtime tax, and non-resident or casual worker rates.</li>
        <li>Employer-specific deductions such as loans, union dues and welfare.</li>
      </ul>

      <h2>Tax years available</h2>
      <ul>
        {listRulesets().map((r) => (
          <li key={r.id}>
            <strong>{r.label}</strong> ({r.effectiveFrom} to {r.effectiveTo}) — sources:{" "}
            {r.sources.map((s, i) => (
              <span key={s.label}>
                {i > 0 && "; "}
                {s.url ? (
                  <a href={s.url} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </Article>
  );
}
