import Link from "next/link";
import { Article } from "@/components/site/Article";
import { pageMetadata } from "@/lib/site";

const path = "/salary-calculator";
const title = "Salary Calculator for Ghana: How to Use It";
export const metadata = pageMetadata({
  path,
  title,
  description: "Use our free salary calculator for Ghana to turn a monthly or annual gross salary into estimated take-home pay. Learn what each input means.",
});

export default function Page() {
  return (
    <Article path={path} title={title} intro="Enter your salary below. Your result updates as you type — no sign-up, and nothing is sent to a server.">
      <h2>What to enter</h2>
      <h3>Basic salary</h3>
      <p>
        Your basic salary before any deductions. This is usually the first line on your payslip or the &quot;basic&quot; figure in your offer
        letter. SSNIT is calculated on this amount only, so do not include allowances here.
      </p>
      <h3>Monthly or annual</h3>
      <p>
        Choose how the salary you typed is paid. If you enter an annual figure, the calculator divides it by 12 (to the pesewa) because employers
        deduct SSNIT and PAYE every month. You can switch the result between monthly and annual views at any time.
      </p>
      <h3>Taxable allowances</h3>
      <p>
        Cash allowances such as transport, housing or fuel allowances that are paid with your salary. They are added to your taxable income but are
        not part of the SSNIT base. Enter them for the same period as your salary (monthly or annual).
      </p>
      <h3>Bonus</h3>
      <p>
        A bonus paid once in the year. Ghana taxes the part of a bonus up to 15% of annual basic salary at a flat 5%; any amount above that is taxed
        together with that month&apos;s pay. The annual view includes the bonus; the monthly view shows a regular month without it.
      </p>
      <h3>Tax rules</h3>
      <p>
        The rates are stored by tax year. The latest set is selected by default and the result always shows which set was used.{" "}
        <Link href="/ghana-salary-calculator">See the rates and where they come from</Link>.
      </p>

      <h2>Reading your result</h2>
      <ul>
        <li>
          <strong>Estimated take-home pay</strong> — what should reach your bank account.
        </li>
        <li>
          <strong>Gross salary</strong> — basic salary plus allowances (and bonus in the annual view).
        </li>
        <li>
          <strong>SSNIT</strong> and <strong>PAYE</strong> — the two statutory deductions most employees in Ghana pay.
        </li>
        <li>
          <strong>Effective tax rate</strong> — PAYE as a share of gross pay. It is always lower than your top band rate because lower slices of
          income are taxed at lower rates.
        </li>
      </ul>
      <p>
        Open &quot;How PAYE was worked out&quot; under the result to see exactly how much of your income fell into each band.
      </p>

      <h2>When your payslip will differ</h2>
      <p>
        The result is an estimate. Your actual pay can differ if you claim personal reliefs, contribute to a voluntary (Tier 3) pension, receive
        benefits in kind, work overtime, or have deductions such as loans, union dues or welfare contributions. See{" "}
        <Link href="/salary-breakdown">how to read a Ghana payslip</Link>.
      </p>
    </Article>
  );
}
