import type { Metadata } from "next";

export const SITE_NAME = "Ghana Salary Calculator";
const PRODUCTION_URL = "https://ghanasalary.cobbold.dev";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000")
).replace(/\/$/, "");

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
  { path: "/salary-comparison", label: "Compare salary offers" },
  { path: "/paye-calculator", label: "PAYE calculator" },
  { path: "/ssnit-calculator", label: "SSNIT calculator" },
  { path: "/salary-breakdown", label: "Salary breakdown & payslips" },
  { path: "/salary-guide", label: "Salary guide" },
  { path: "/sitemap-directory", label: "HTML Sitemap Directory" },
  { path: "/privacy", label: "Privacy" },
];

export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_GH",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
