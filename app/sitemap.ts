import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { readStore } from "@/lib/store";

/**
 * One-page site, so one URL. The section anchors (#services, #work…)
 * are deliberately not listed: they are fragments of this page, not
 * separate documents, and Google ignores them in a sitemap.
 *
 * `lastModified` tracks the project store, so publishing work from the
 * admin panel gives crawlers a real signal that the page changed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updatedAt } = await readStore();

  return [
    {
      url: siteUrl,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
