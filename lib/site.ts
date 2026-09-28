import type { Metadata } from "next";

export const SITE_NAME = "Ghana Salary Calculator";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export interface SitePage {
  path: string;
  label: string;
}

/** Every public, indexable page. Used for navigation, related links and the sitemap. */
export const PAGES: SitePage[] = [
  { path: "/", label: "Salary calculator" },
  { path: "/salary-calculator", label: "How to use the calculator" },
  { path: "/ghana-salary-calculator", label: "Ghana tax rules & method" },
  { path: "/take-home-pay", label: "Take-home pay" },
  { path: "/gross-to-net", label: "Gross to net salary" },
  { path: "/net-to-gross", label: "Net to gross calculator" },
  { path: "/paye-calculator", label: "PAYE calculator" },
  { path: "/ssnit-calculator", label: "SSNIT calculator" },
  { path: "/salary-breakdown", label: "Salary breakdown & payslips" },
  { path: "/salary-guide", label: "Salary guide" },
  { path: "/privacy", label: "Privacy" },
];

export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, locale: "en_GH", type: "website" },
    twitter: { card: "summary", title, description },
  };
}
