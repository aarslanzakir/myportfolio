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
    /* Only Yandex acts on `Host:`. Google and Bing pick the canonical
       host from the <link rel="canonical"> tag and your redirects, so
       still point www at the apex domain at the DNS/host level. */
    host: siteUrl,
  };
}
