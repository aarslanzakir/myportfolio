import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton, Section } from "@/components/ui";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";
import { profile, whatsappUrl } from "@/lib/content";
import {
  abs,
  buildCaseStudyJsonLd,
  caseStudyPath,
  serializeJsonLd,
  servicePath,
} from "@/lib/seo";
import { serviceBySlug } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

/** Empty until case studies are written, which generates no routes. */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = caseStudyBySlug((await params).slug);
  if (!study) return {};

  const url = caseStudyPath(study.slug);

  return {
    title: study.metaTitle,
    description: study.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: abs(url),
      title: `${study.metaTitle} | ${profile.name}`,
      description: study.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.metaTitle} | ${profile.name}`,
      description: study.metaDescription,
    },
  };
}

/** Label/value pairs in the header strip. */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-[0.14em] text-mist-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-mist-100">{value}</dd>
    </div>
  );
}

function Prose({ heading, id, body }: { heading: string; id: string; body: string[] }) {
  return (
    <Reveal>
      <h2
        id={id}
        className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
      >
        {heading}
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        {body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-pretty text-base leading-relaxed text-mist-400 sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const study = caseStudyBySlug((await params).slug);
  if (!study) notFound();

  /* Only services that actually exist, so a typo in a slug drops the
     link rather than rendering a dead one. */
  const linkedServices = study.services
    .map((slug) => serviceBySlug(slug))
    .filter((service) => service !== undefined);

  const others = caseStudies.filter((s) => s.slug !== study.slug).slice(0, 3);

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCaseStudyJsonLd(study)),
        }}
      />

      {/* ---------------- header ---------------- */}
      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Case studies", href: "/case-studies" },
            { label: study.client },
          ]}
        />

        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
            <Icon name="sparkles" className="size-3.5" />
            Case study
          </span>

          <h1 className="mt-6 text-balance text-[2rem] leading-[1.1] font-semibold tracking-tight text-mist-50 sm:text-[2.75rem] lg:text-5xl">
            {study.title}
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
            {study.metaDescription}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/[0.07] pt-8 sm:grid-cols-4">
            <Meta label="Client" value={study.client} />
            <Meta label="Year" value={study.year} />
            <Meta label="Role" value={study.role} />
            <Meta label="Duration" value={study.duration} />
          </dl>
        </Reveal>

        {study.stack.length > 0 && (
          <Reveal delay={140}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-lg border border-white/[0.09] bg-ink-900/70 px-2.5 py-1 font-mono text-xs text-mist-200"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {study.link && (
          <Reveal delay={180}>
            <div className="mt-8">
              <GhostButton href={study.link} icon="arrow" external>
                Visit the live site
              </GhostButton>
            </div>
          </Reveal>
        )}
      </Section>

      {/* ---------------- the story ---------------- */}
      <Section id="story">
        <h2 id="story-heading" className="sr-only">
          Project details
        </h2>

        <div className="flex max-w-3xl flex-col gap-14">
          <Prose heading="The challenge" id="challenge" body={study.challenge} />
          <Prose heading="The approach" id="approach" body={study.approach} />
          <Prose heading="The outcome" id="outcome" body={study.outcome} />
        </div>
      </Section>

      {/* ---------------- results ---------------- */}
      {study.results && study.results.length > 0 && (
        <Section id="results">
          <Reveal>
            <h2
              id="results-heading"
              className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
            >
              Results
            </h2>
          </Reveal>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {study.results.map((result, i) => (
              <Reveal key={result.label} delay={i * 70}>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
                  <dt className="text-sm text-mist-400">{result.label}</dt>
                  <dd className="text-gradient mt-2 font-display text-3xl font-semibold">
                    {result.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>
      )}

      {/* ---------------- testimonial ---------------- */}
      {study.testimonial && (
        <Section id="testimonial">
          <h2 id="testimonial-heading" className="sr-only">
            Client feedback
          </h2>
          <Reveal>
            <figure className="ring-gradient relative overflow-hidden rounded-3xl">
              <span className="ring-gradient-inner" />
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.015] p-8 sm:p-10">
                <blockquote className="text-pretty text-lg leading-relaxed text-mist-100 sm:text-xl">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-mist-400">
                  <span className="font-medium text-mist-100">
                    {study.testimonial.author}
                  </span>
                  {" — "}
                  {study.testimonial.role}
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </Section>
      )}

      {/* ---------------- services used ----------------
          Links the story back to the commercial page. A prospect who
          reads this and wants the same thing lands where they can buy. */}
      {linkedServices.length > 0 && (
        <Section id="services-used">
          <Reveal>
            <h2
              id="services-used-heading"
              className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
            >
              Want something like this?
            </h2>
          </Reveal>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {linkedServices.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={i * 60}>
                <Link
                  href={servicePath(service.slug)}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
                >
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-accent-300">
                    <Icon name={service.icon} className="size-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-mist-50">
                      {service.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-mist-400">
                      {service.blurb}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href={whatsappUrl} external icon="whatsapp">
                Discuss your project
              </PrimaryButton>
            </div>
          </Reveal>
        </Section>
      )}

      {/* ---------------- more case studies ---------------- */}
      {others.length > 0 && (
        <Section id="more-work">
          <Reveal>
            <h2
              id="more-work-heading"
              className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
            >
              More work
            </h2>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <Reveal as="li" key={other.slug} delay={i * 60}>
                <Link
                  href={caseStudyPath(other.slug)}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
                >
                  <span className="text-xs font-medium tracking-wide text-accent-300 uppercase">
                    {other.client}
                  </span>
                  <span className="mt-3 block text-base font-semibold text-mist-50">
                    {other.title}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}
