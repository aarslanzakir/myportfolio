import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { abs, caseStudyPath, servicePath, siteUrl } from "@/lib/seo";
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
      /* The canonical page for the name query, so it ranks just under
         the home page rather than competing with it. */
      url: abs("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: abs("/services"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    /* Index only exists once there is something to list; it 404s when
       the array is empty, so listing it then would report a soft 404. */
    ...(caseStudies.length > 0
      ? [
          {
            url: abs("/case-studies"),
            lastModified,
            changeFrequency: "monthly" as const,
            priority: 0.9,
          },
          ...caseStudies.map((study) => ({
            url: abs(caseStudyPath(study.slug)),
            lastModified,
            changeFrequency: "yearly" as const,
            priority: 0.8,
          })),
        ]
      : []),
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
