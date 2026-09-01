/**
 * ============================================================
 *  SEO: canonical URLs + JSON-LD structured data
 *  Everything search engines read about this site that isn't
 *  visible copy lives here. Content itself stays in content.ts.
 * ============================================================
 */

import { faqs, profile, services, skillGroups } from "./content";
import type { CaseStudy } from "./case-studies";
import type { Service } from "./services";
import type { Project } from "./project-schema";

/**
 * The origin Google will index. Every canonical tag, sitemap entry and
 * schema @id is built from this, so pointing it at a domain that is not
 * actually serving the site is the one setting that can stop the whole
 * site being indexed: Google crawls where you are, reads a canonical
 * saying "the real one is elsewhere", and indexes neither.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL      your real domain, once you have one
 *   2. VERCEL_PROJECT_PRODUCTION_URL   Vercel's stable production host,
 *      injected automatically. Not VERCEL_URL, which is unique per
 *      deployment and would make canonicals churn on every push.
 *   3. localhost, so a local build never emits someone else's domain.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

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

/* ------------------------------------------------------------------ */
/*  Service landing pages                                              */
/* ------------------------------------------------------------------ */

export const servicePath = (slug: string) => `/services/${slug}`;

/**
 * Per-service graph. The Service node points back at the same Person
 * @id the home page declares, so Google reads one provider with six
 * offerings rather than six unrelated businesses.
 */
export function buildServiceJsonLd(service: Service, related: Project[]) {
  const url = abs(servicePath(service.slug));
  const pageId = `${url}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: service.metaTitle,
        description: service.metaDescription,
        url,
        provider: { "@id": ID.person },
        areaServed: { "@type": "Place", name: "Worldwide" },
        ...(related.length > 0 && {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${service.title} work`,
            itemListElement: related.map((project) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "CreativeWork",
                name: project.title,
                ...(project.summary && { description: project.summary }),
                ...(project.link &&
                  !project.privateDemo && { url: project.link }),
              },
            })),
          },
        }),
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: service.metaTitle,
        description: service.metaDescription,
        isPartOf: { "@id": ID.website },
        about: { "@id": `${url}#service` },
        inLanguage: "en",
      },
      /* Breadcrumbs give Google the "Home > Services > X" trail it shows
         in place of a raw URL in the result. */
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: abs("/services"),
          },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": pageId },
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}

/** Index page listing every service. */
export function buildServiceIndexJsonLd() {
  const url = abs("/services");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `Services | ${profile.name}`,
        isPartOf: { "@id": ID.website },
        about: { "@id": ID.person },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${url}#list`,
        numberOfItems: services.length,
        itemListElement: services.map((service, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: service.title,
          url: abs(servicePath(service.slug)),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Case studies                                                       */
/* ------------------------------------------------------------------ */

export const caseStudyPath = (slug: string) => `/case-studies/${slug}`;

/**
 * Article rather than CreativeWork: a case study is a written piece
 * about the work, not the work itself. `author` and `publisher` both
 * point at the same Person @id the home page declares.
 */
export function buildCaseStudyJsonLd(study: CaseStudy) {
  const url = abs(caseStudyPath(study.slug));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: study.title,
        description: study.metaDescription,
        url,
        author: { "@id": ID.person },
        publisher: { "@id": ID.person },
        inLanguage: "en",
        /* No fabricated timestamps: a year is what we actually know. */
        datePublished: study.year,
        keywords: study.stack.join(", "),
        about: {
          "@type": "CreativeWork",
          name: study.title,
          ...(study.link && { url: study.link }),
        },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: study.metaTitle,
        description: study.metaDescription,
        isPartOf: { "@id": ID.website },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case studies",
            item: abs("/case-studies"),
          },
          /* Must match the visible trail in Breadcrumbs, which uses the
             client name: a long title makes an unreadable crumb. */
          { "@type": "ListItem", position: 3, name: study.client, item: url },
        ],
      },
    ],
  };
}

/** Index page listing every published case study. */
export function buildCaseStudyIndexJsonLd(studies: CaseStudy[]) {
  const url = abs("/case-studies");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `Case studies | ${profile.name}`,
        isPartOf: { "@id": ID.website },
        about: { "@id": ID.person },
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${url}#list`,
        numberOfItems: studies.length,
        itemListElement: studies.map((study, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: study.title,
          url: abs(caseStudyPath(study.slug)),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Case studies", item: url },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  About page                                                         */
/* ------------------------------------------------------------------ */

/**
 * The canonical "who is this person" page.
 *
 * ProfilePage with `mainEntity` pointing at the Person @id is the exact
 * shape Google looks for when deciding what to show for a name query,
 * so this page is the strongest single signal for searches on the name
 * itself. Everything references the same @id as the home page, so the
 * two reinforce one entity rather than competing as two.
 */
export function buildAboutJsonLd() {
  const url = abs("/about");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: `About ${profile.name}`,
        description: `${profile.name} is a full-stack developer and AI automation engineer with ${profile.yearsExperience}+ years of experience.`,
        isPartOf: { "@id": ID.website },
        about: { "@id": ID.person },
        mainEntity: { "@id": ID.person },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "About", item: url },
        ],
      },
    ],
  };
}
