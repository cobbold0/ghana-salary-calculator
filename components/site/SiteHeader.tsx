import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/paye-calculator", label: "PAYE" },
  { href: "/ssnit-calculator", label: "SSNIT" },
  { href: "/salary-guide", label: "Guide" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm text-brand-contrast">
            ₵
          </span>
          <span className="text-base sm:text-lg">{SITE_NAME}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md px-2 py-2 text-muted hover:bg-brand-soft hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
