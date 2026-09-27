import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "/" : p.path}`,
    changeFrequency: "monthly",
    priority: p.path === "/" ? 1 : p.path === "/privacy" ? 0.2 : 0.8,
  }));
}
