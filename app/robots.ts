import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* The admin panel and the JSON API have nothing for a crawler
           and would otherwise show up as thin/duplicate results. */
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    /* Declares the canonical host, so a staging or www duplicate
       doesn't compete with the real domain. */
    host: siteUrl,
  };
}
