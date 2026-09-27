import Link from "next/link";
import { SalaryCalculator } from "@/components/calculator/SalaryCalculator";
import { AdSlot } from "@/components/site/AdSlot";
import { JsonLd } from "@/components/site/Article";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Free Ghana salary calculator. Enter your gross salary to estimate take-home pay after SSNIT and PAYE, with a clear breakdown and the tax rules used.";

export const metadata = {
  ...pageMetadata({ path: "/", title: "Ghana Salary Calculator: Estimate Take-Home Pay after PAYE & SSNIT", description }),
  title: { absolute: "Ghana Salary Calculator: Estimate Take-Home Pay after PAYE & SSNIT" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          description,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "GHS" },
        }}
      />
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Ghana Salary Calculator</h1>
        <p className="mt-3 text-lg text-muted">
          Estimate your take-home pay after SSNIT and PAYE. See every deduction, switch between monthly and annual, and check the tax rules used.
        </p>
      </header>

      <SalaryCalculator />

      <section className="prose mt-12 max-w-3xl">
        <h2>How your take-home pay is estimated</h2>
        <ol>
          <li>
            <strong>SSNIT</strong> — 5.5% of your basic salary is deducted as your pension contribution (up to a monthly ceiling).{" "}
            <Link href="/ssnit-calculator">More about SSNIT</Link>.
          </li>
          <li>
            <strong>Taxable income</strong> — basic salary plus taxable allowances, minus your SSNIT contribution.
          </li>
          <li>
            <strong>PAYE</strong> — income tax on taxable income, charged in progressive bands from 0% to 35%.{" "}
            <Link href="/paye-calculator">See the PAYE bands</Link>.
          </li>
          <li>
            <strong>Take-home pay</strong> — gross salary minus SSNIT and PAYE. <Link href="/gross-to-net">Gross to net explained</Link>.
          </li>
        </ol>
        <p>
          Every result shows the tax year, the assumptions behind it and what is not included, so you can compare it with your payslip. Read the{" "}
          <Link href="/ghana-salary-calculator">full method and rules</Link>.
        </p>
      </section>

      <AdSlot />

      <section className="prose mt-10 max-w-3xl">
        <h2>Guides</h2>
        <ul>
          <li>
            <Link href="/take-home-pay">What is take-home pay?</Link>
          </li>
          <li>
            <Link href="/salary-breakdown">How to read a Ghana payslip</Link>
          </li>
          <li>
            <Link href="/salary-guide">Monthly vs annual salary and understanding job offers</Link>
          </li>
          <li>
            <Link href="/salary-calculator">How to use this calculator</Link>
          </li>
        </ul>
      </section>
    </>
  );
}
