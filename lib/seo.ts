/**
 * ============================================================
 *  SEO: canonical URLs + JSON-LD structured data
 *  Everything search engines read about this site that isn't
 *  visible copy lives here. Content itself stays in content.ts.
 * ============================================================
 */

import { faqs, profile, services, skillGroups } from "./content";
import type { Project } from "./project-schema";

/**
 * Set NEXT_PUBLIC_SITE_URL in your host's env. It must be the exact
 * origin Google will index (https, no trailing slash) or canonical
 * tags, the sitemap and social cards will all point at the wrong host.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aliarslanzakir.com"
).replace(/\/$/, "");

export const jobTitle = "Full-Stack Developer & AI Automation Engineer";

export const siteTitle = `${profile.name} | ${jobTitle}`;

export const siteDescription =
  `${profile.yearsExperience}+ years building MERN, MEAN and Laravel web apps, mobile apps, ` +
  `Python back-ends, blockchain platforms and AI automation. Hourly, weekly or fixed price. ` +
  `Available for new client projects.`;

/** Absolute URL helper: canonical/JSON-LD must never emit relative paths. */
export const abs = (path = "/") => new URL(path, siteUrl).toString();

/** Verified profile URLs. Google uses these to merge the Person entity. */
const sameAs = Object.values(profile.socials).filter(Boolean);

/* ------------------------------------------------------------------ */
/*  Stable @id anchors so the nodes below reference one another
    instead of duplicating the same entity three times.                */
/* ------------------------------------------------------------------ */

const ID = {
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
  page: `${siteUrl}/#webpage`,
  faq: `${siteUrl}/#faq`,
  work: `${siteUrl}/#work`,
};

/** Everything skillGroups lists, flattened: feeds Person.knowsAbout. */
const knowsAbout = [
  ...new Set(skillGroups.flatMap((group) => group.items)),
];

/**
 * One @graph rather than several <script> tags. Google prefers it,
 * and it lets Person/WebSite/WebPage cross-reference by @id so the
 * entities are merged instead of parsed as unrelated fragments.
 */
export function buildJsonLd(projects: Project[]) {
  const person = {
    "@type": "Person",
    "@id": ID.person,
    name: profile.name,
    jobTitle,
    description: siteDescription,
    url: siteUrl,
    image: abs("/mine.png"),
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
    knowsAbout,
    knowsLanguage: ["en"],
    ...(sameAs.length > 0 && { sameAs }),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.blurb,
        serviceType: service.title,
        provider: { "@id": ID.person },
        areaServed: { "@type": "Place", name: "Worldwide" },
      },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": ID.website,
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    inLanguage: "en",
    publisher: { "@id": ID.person },
  };

  const webPage = {
    "@type": ["WebPage", "ProfilePage"],
    "@id": ID.page,
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.person },
    mainEntity: { "@id": ID.person },
    inLanguage: "en",
  };

  /* FAQ rich results: the answers are already server-rendered in the
     page, which is what Google requires for this markup to qualify. */
  const faqPage = {
    "@type": "FAQPage",
    "@id": ID.faq,
    isPartOf: { "@id": ID.page },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  /* Portfolio pieces. Private demos are still listed as work, just
     without a URL Google could try to crawl. */
  const portfolio = {
    "@type": "ItemList",
    "@id": ID.work,
    name: `Selected work by ${profile.name}`,
    numberOfItems: projects.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        ...(project.summary && { description: project.summary }),
        ...(project.link && !project.privateDemo && { url: project.link }),
        genre: project.category,
        creator: { "@id": ID.person },
        ...(project.stack.length > 0 && { keywords: project.stack.join(", ") }),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, webPage, faqPage, portfolio],
  };
}

/**
 * JSON-LD goes in via dangerouslySetInnerHTML, so a "</script>" inside
 * any content string would close the tag early. Escaping "<" blocks that.
 */
export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\u003c");
