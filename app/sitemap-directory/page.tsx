import Link from "next/link";
import { PAGES, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  path: "/sitemap-directory",
  title: "Site Directory & Sitemap — Ghana Salary Calculator",
  description: "Browse all tools, salary guides, PAYE tax tables, and pension resources available on Ghana Salary Calculator.",
});

export default function SitemapDirectoryPage() {
  return (
    <article className="prose max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Site Directory & Resource Index</h1>
        <p className="mt-2 text-muted">
          All calculators, statutory deductions guides, and tax resources available on Ghana Salary Calculator.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {PAGES.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="flex flex-col justify-between rounded-lg border border-border p-4 transition hover:border-primary/50 hover:bg-surface/80 no-underline"
          >
            <span className="font-semibold text-foreground">{page.label}</span>
            <span className="text-xs text-muted mt-1">{page.path}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
