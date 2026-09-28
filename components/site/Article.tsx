import Link from "next/link";
import { AdSlot } from "@/components/site/AdSlot";
import { SalaryCalculator } from "@/components/calculator/SalaryCalculator";
import { PAGES, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Shared layout for public content pages: H1 + intro, optional calculator,
 * article body, an ad slot well below the calculator, and related links.
 */
export function Article({
  path,
  title,
  intro,
  calculator = <SalaryCalculator />,
  children,
}: {
  path: string;
  title: string;
  intro: React.ReactNode;
  /** Calculator shown above the article; `null` for none. */
  calculator?: React.ReactNode;
  children: React.ReactNode;
}) {
  const related = PAGES.filter((p) => p.path !== path && p.path !== "/privacy");
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}${path}` },
    ],
  };
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        <div className="mt-3 text-lg text-muted">{intro}</div>
      </header>
      {calculator}
      <article className="prose mt-10 max-w-3xl">{children}</article>
      <AdSlot />
      <nav aria-labelledby="related-title" className="mt-10 max-w-3xl">
        <h2 id="related-title" className="mb-3 text-lg font-semibold">
          Related
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((p) => (
            <li key={p.path}>
              <Link href={p.path} className="block rounded-lg border border-border bg-surface px-4 py-3 text-sm hover:border-brand">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
