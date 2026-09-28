import Link from "next/link";
import { PAGES, SITE_NAME } from "@/lib/site";
import { ConsentSettingsButton } from "./ConsentBanner";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-sm text-muted">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {PAGES.map((p) => (
              <li key={p.path}>
                <Link href={p.path} className="hover:text-foreground hover:underline">
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsButton />
            </li>
          </ul>
        </nav>
        <p className="mt-6 max-w-3xl">
          {SITE_NAME} gives estimates for information only. It is not affiliated with the Ghana Revenue Authority (GRA) or SSNIT, and it is not
          payroll, tax or financial advice. Your payslip may differ.
        </p>
      </div>
    </footer>
  );
}
