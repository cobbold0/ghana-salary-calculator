import Link from "next/link";
import { SalaryCalculator } from "@/components/calculator/SalaryCalculator";
import { AdSlot } from "@/components/site/AdSlot";
import { JsonLd } from "@/components/site/Article";
import { AddThis } from "@/components/social/AddThis";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Free Ghana salary calculator. Enter your gross salary to estimate take-home pay after SSNIT and PAYE, with a clear breakdown and the tax rules used.";

export const metadata = {
  ...pageMetadata({ path: "/", title: "Ghana Salary Calculator: Estimate Take-Home Pay after PAYE & SSNIT", description }),
  title: { absolute: "Ghana Salary Calculator: Estimate Take-Home Pay after PAYE & SSNIT" },
};

const faqs = [
  {
    question: "What is the difference between Gross Salary and Net Salary in Ghana?",
    answer:
      "Gross salary is the total agreed compensation before any mandatory deductions. In Ghana, net salary (take-home pay) is what remains after deducting the 5.5% employee Social Security and National Insurance Trust (SSNIT) contribution and Pay-As-You-Earn (PAYE) income tax administered by the Ghana Revenue Authority (GRA).",
  },
  {
    question: "How is SSNIT calculated in Ghana?",
    answer:
      "Under the National Pensions Act (Act 766), employees contribute 5.5% of their basic gross monthly salary toward SSNIT (Tier 1 and Tier 2 schemes). Employers contribute an additional 13%, bringing total mandatory contributions to 18.5%. Employee contributions are exempt from PAYE income tax.",
  },
  {
    question: "What are the current Ghana PAYE tax bands?",
    answer:
      "Ghana uses progressive income tax bands: the first GHS 490 per month is taxed at 0%, the next GHS 110 at 5%, the next GHS 130 at 10%, the next GHS 3,166.67 at 17.5%, the next GHS 16,000 at 25%, the next GHS 30,520 at 30%, and any taxable income exceeding GHS 50,416.67 at 35%.",
  },
  {
    question: "Are allowances taxed in Ghana?",
    answer:
      "Cash allowances (such as rent allowance, risk allowance, responsibility allowance, and fuel allowance) are generally added to basic taxable income and taxed under standard PAYE progressive rates. Specific statutory reliefs or approved non-taxable benefits may reduce overall taxable income.",
  },
  {
    question: "How do overtime and bonuses get taxed in Ghana?",
    answer:
      "Qualifying bonuses up to 15% of annual basic salary are taxed at a concessionary final withholding rate of 5%. Any bonus excess above 15% is added to monthly taxable income and taxed at progressive marginal rates. Overtime paid to qualifying junior employees also enjoys statutory concessionary tax rates.",
  },
  {
    question: "How do I calculate take-home pay for an expatriate or non-resident in Ghana?",
    answer:
      "Non-resident individuals earning employment income in Ghana are generally taxed at a flat rate of 25% on their total gross income without enjoying the graduated tax-free allowance bands available to resident employees.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/icon.svg`,
            sameAs: ["https://twitter.com/GhanaSalaryCalc", "https://github.com/cobbold0/ghana-salary-calculator"],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE_NAME,
            url: `${SITE_URL}/`,
            description,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "GHS" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />

      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl text-foreground">Ghana Salary Calculator</h1>
        <p className="mt-3 text-lg text-muted">
          Accurate take-home pay estimator based on current Ghana Revenue Authority (GRA) PAYE tax bands and 5.5% SSNIT deductions.
        </p>
      </header>

      {/* Main Interactive Tool */}
      <SalaryCalculator />

      {/* Ad Placement 1: Directly below interactive results */}
      <AdSlot variant="inline" label="Advertisement" className="my-8" />

      {/* Social Sharing Widget */}
      <AddThis className="my-8" />

      {/* Deep Explanatory Content for High SEO Authority & Quality */}
      <section className="prose mt-12 max-w-3xl">
        <h2>How Ghana Salary Deductions Work (PAYE & SSNIT)</h2>
        <p>
          Calculating your monthly net salary in Ghana involves applying statutory deductions determined by the
          <strong> Ghana Revenue Authority (GRA)</strong> and the <strong>Social Security and National Insurance Trust (SSNIT)</strong>.
          Every formal sector employee in Ghana is subject to two mandatory deductions:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 not-prose my-6">
          <div className="rounded-xl border border-border p-4 bg-surface">
            <h3 className="font-bold text-foreground">1. SSNIT Pension (5.5%)</h3>
            <p className="mt-2 text-sm text-muted">
              5.5% of your basic monthly earnings is deducted as your Tier 1 and Tier 2 pension contribution.
              This deduction is 100% tax-exempt and subtracted before PAYE is calculated.
            </p>
          </div>
          <div className="rounded-xl border border-border p-4 bg-surface">
            <h3 className="font-bold text-foreground">2. GRA PAYE Income Tax</h3>
            <p className="mt-2 text-sm text-muted">
              Pay-As-You-Earn (PAYE) is calculated on your remaining taxable income using progressive graduated brackets,
              starting at 0% for low earners up to 35% for top brackets.
            </p>
          </div>
        </div>

        <h3>Ghana Revenue Authority (GRA) Monthly Income Tax Bands</h3>
        <p>
          Under the Income Tax Act (Act 896 as amended), resident employees in Ghana are taxed according to progressive
          graduated tax bands:
        </p>

        <div className="overflow-x-auto my-6 not-prose">
          <table className="w-full text-left text-sm border-collapse rounded-lg border border-border overflow-hidden">
            <thead className="bg-muted/10 font-semibold text-foreground">
              <tr>
                <th className="p-3 border-b border-border">Taxable Income Bracket (GHS)</th>
                <th className="p-3 border-b border-border">Tax Rate</th>
                <th className="p-3 border-b border-border">Max Tax in Band (GHS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">First GHS 490.00</td>
                <td className="p-3 font-semibold text-emerald-600">0% (Tax-Free)</td>
                <td className="p-3">0.00</td>
              </tr>
              <tr>
                <td className="p-3">Next GHS 110.00 (490.01 – 600.00)</td>
                <td className="p-3">5%</td>
                <td className="p-3">5.50</td>
              </tr>
              <tr>
                <td className="p-3">Next GHS 130.00 (600.01 – 730.00)</td>
                <td className="p-3">10%</td>
                <td className="p-3">13.00</td>
              </tr>
              <tr>
                <td className="p-3">Next GHS 3,166.67 (730.01 – 3,896.67)</td>
                <td className="p-3">17.5%</td>
                <td className="p-3">554.17</td>
              </tr>
              <tr>
                <td className="p-3">Next GHS 16,000.00 (3,896.68 – 19,896.67)</td>
                <td className="p-3">25%</td>
                <td className="p-3">4,000.00</td>
              </tr>
              <tr>
                <td className="p-3">Next GHS 30,520.00 (19,896.68 – 50,416.67)</td>
                <td className="p-3">30%</td>
                <td className="p-3">9,156.00</td>
              </tr>
              <tr>
                <td className="p-3">Exceeding GHS 50,416.67</td>
                <td className="p-3 font-semibold text-amber-600">35%</td>
                <td className="p-3">Remaining Balance × 35%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Worked Example: Gross Salary of GHS 5,000</h3>
        <p>Here is how a gross salary of GHS 5,000 per month is processed:</p>
        <ol>
          <li>
            <strong>Step 1 (SSNIT Deduction):</strong> Basic salary GHS 5,000 × 5.5% = <strong>GHS 275.00</strong>.
          </li>
          <li>
            <strong>Step 2 (Taxable Income):</strong> Gross GHS 5,000 − SSNIT GHS 275.00 = <strong>GHS 4,725.00</strong>.
          </li>
          <li>
            <strong>Step 3 (Progressive PAYE Computation):</strong>
            <ul>
              <li>First GHS 490.00 @ 0% = GHS 0.00</li>
              <li>Next GHS 110.00 @ 5% = GHS 5.50</li>
              <li>Next GHS 130.00 @ 10% = GHS 13.00</li>
              <li>Next GHS 3,166.67 @ 17.5% = GHS 554.17</li>
              <li>Remaining GHS 828.33 (4,725.00 − 3,896.67) @ 25% = GHS 207.08</li>
              <li>Total PAYE Tax = GHS 5.50 + 13.00 + 554.17 + 207.08 = <strong>GHS 779.75</strong></li>
            </ul>
          </li>
          <li>
            <strong>Step 4 (Net Take-Home Pay):</strong> Gross GHS 5,000 − SSNIT GHS 275.00 − PAYE GHS 779.75 = <strong>GHS 3,945.25</strong>.
          </li>
        </ol>
      </section>

      {/* Ad Placement 2: Mid-content between guide and FAQ */}
      <AdSlot variant="inline" label="Sponsored Links" className="my-8" />

      {/* Frequently Asked Questions */}
      <section className="prose mt-12 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <div className="not-prose space-y-4 my-6">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-border p-5 bg-surface/40">
              <h3 className="font-semibold text-foreground text-base">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Guides & Resources Navigation */}
      <section className="prose mt-12 max-w-3xl">
        <h2>Explore More Ghana Salary Tools & Guides</h2>
        <div className="grid gap-3 sm:grid-cols-2 not-prose my-6">
          <Link
            href="/net-to-gross"
            className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition"
          >
            <div className="font-semibold text-foreground">Net-to-Gross Calculator</div>
            <div className="text-xs text-muted mt-1">Determine required gross offer from target take-home pay.</div>
          </Link>
          <Link
            href="/salary-comparison"
            className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition"
          >
            <div className="font-semibold text-foreground">Compare Job Offers</div>
            <div className="text-xs text-muted mt-1">Side-by-side comparison of multiple salary offers and perks.</div>
          </Link>
          <Link
            href="/paye-calculator"
            className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition"
          >
            <div className="font-semibold text-foreground">PAYE Tax Tables</div>
            <div className="text-xs text-muted mt-1">Detailed guide to Ghana Revenue Authority progressive bands.</div>
          </Link>
          <Link
            href="/ssnit-calculator"
            className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition"
          >
            <div className="font-semibold text-foreground">SSNIT Pension Rules</div>
            <div className="text-xs text-muted mt-1">Learn how Tier 1, Tier 2, and Tier 3 pensions operate.</div>
          </Link>
          <Link
            href="/sitemap-directory"
            className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition"
          >
            <div className="font-semibold text-foreground">All Tools Directory</div>
            <div className="text-xs text-muted mt-1">View the complete list of salary resources and tools.</div>
          </Link>
        </div>
      </section>
    </>
  );
}
