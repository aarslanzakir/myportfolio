import type { MetadataRoute } from "next";
import { abs, servicePath, siteUrl } from "@/lib/seo";
import { services } from "@/lib/services";
import { readStore } from "@/lib/store";

/**
 * The home page plus the services cluster. Section anchors (#work,
 * #contact…) are deliberately absent: they are fragments of a page, not
 * separate documents, and Google ignores them here.
 *
 * `lastModified` tracks the project store, so publishing work from the
 * admin panel gives crawlers a real signal that content changed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { updatedAt } = await readStore();
  const lastModified = new Date(updatedAt);

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: abs("/services"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...services.map((service) => ({
      url: abs(servicePath(service.slug)),
      lastModified,
      changeFrequency: "monthly" as const,
      /* Below the index, above nothing: priority is only a relative hint
         within your own sitemap, and Google largely ignores it anyway. */
      priority: 0.8,
    })),
  ];
}
