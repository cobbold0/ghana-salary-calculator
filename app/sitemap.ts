import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date("2026-11-03");

  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: currentDate,
    changeFrequency: p.path === "/" ? "daily" : "weekly",
    priority: p.path === "/" ? 1.0 : p.path === "/privacy" ? 0.3 : 0.8,
  }));
}
