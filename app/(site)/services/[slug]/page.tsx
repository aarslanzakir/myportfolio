import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton, Section } from "@/components/ui";
import { caseStudiesForService } from "@/lib/case-studies";
import { profile, whatsappUrl } from "@/lib/content";
import { services, serviceBySlug } from "@/lib/services";
import {
  abs,
  buildServiceJsonLd,
  caseStudyPath,
  serializeJsonLd,
  servicePath,
} from "@/lib/seo";
import { listProjects } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

/** All six are known at build time, so every service page prerenders. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return {};

  const url = servicePath(service.slug);

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: abs(url),
      title: `${service.metaTitle} | ${profile.name}`,
      description: service.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.metaTitle} | ${profile.name}`,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();

  /* Real work in the same categories, used as proof on the page. Capped
     because a wall of 51 cards buries the call to action. */
  const related = (await listProjects())
    .filter((project) => service.categories.includes(project.category))
    .slice(0, 6);

  const others = services.filter((s) => s.slug !== service.slug);

  /* Long-form proof for this service. Empty until case studies exist. */
  const studies = caseStudiesForService(service.slug);

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildServiceJsonLd(service, related)),
        }}
      />

      {/* ---------------- hero ---------------- */}
      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.title },
          ]}
        />

        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
            <Icon name={service.icon} className="size-3.5" />
            Service
          </span>

          <h1 className="mt-6 text-balance text-[2.15rem] leading-[1.08] font-semibold tracking-tight text-mist-50 sm:text-5xl lg:text-[3.25rem]">
            {service.title}
          </h1>

          <div className="mt-7 flex flex-col gap-5">
            {service.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-pretty text-base leading-relaxed text-mist-400 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href={whatsappUrl} external icon="whatsapp">
              Discuss your project
            </PrimaryButton>
            <GhostButton href="/#work" icon="layers">
              See the work
            </GhostButton>
          </div>
        </Reveal>
      </Section>

      {/* ---------------- what's included ---------------- */}
      <Section id="included">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2
              id="included-heading"
              className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
            >
              What this <span className="text-gradient">covers</span>
            </h2>
            <ul className="mt-7 flex flex-col gap-3">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-base text-mist-300"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-accent-400/30 bg-accent-400/10 text-accent-300">
                    <Icon name="check" className="size-3" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl">
              What you <span className="text-gradient">receive</span>
            </h2>
            <ul className="mt-7 flex flex-col gap-3">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base text-mist-300"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                    <Icon name="check" className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- proof ---------------- */}
      {related.length > 0 && (
        <Section id="proof">
          <Reveal>
            <h2
              id="proof-heading"
              className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
            >
              Work I&apos;ve shipped in{" "}
              <span className="text-gradient">this area</span>
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((project, i) => {
              const clickable = Boolean(project.link) && !project.privateDemo;

              const card = (
                <article className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]">
                  <span className="text-xs font-medium tracking-wide text-accent-300 uppercase">
                    {project.category}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-mist-50">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-mist-400">
                      {project.summary}
                    </p>
                  )}
                  {project.stack.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5 pt-1">
                      {project.stack.slice(0, 4).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-white/[0.09] bg-ink-900/70 px-2 py-0.5 font-mono text-[11px] text-mist-300"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );

              return (
                <Reveal as="li" key={project.id} delay={i * 60}>
                  {clickable ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}
          </ul>
        </Section>
      )}

      {/* ---------------- service-specific FAQ ---------------- */}
      <Section id="service-faq">
        <Reveal>
          <h2
            id="service-faq-heading"
            className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
          >
            Questions about{" "}
            <span className="text-gradient">{service.title.toLowerCase()}</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3">
          {service.faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] transition-colors duration-300 open:border-white/[0.14] open:bg-white/[0.045] hover:border-white/[0.12]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left sm:p-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-medium text-mist-50 sm:text-lg">
                    {faq.q}
                  </h3>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-accent-300 transition-transform duration-300 group-open:rotate-45">
                    <Icon name="plus" className="size-4" />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-mist-400 sm:px-6 sm:pb-6 sm:text-base">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- case studies ----------------
          A card proves the work happened; a case study proves you can
          think. Where one exists for this service, it outranks the
          project grid as the thing to send a prospect. */}
      {studies.length > 0 && (
        <Section id="case-studies">
          <Reveal>
            <h2
              id="case-studies-heading"
              className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
            >
              Read the <span className="text-gradient">full story</span>
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study, i) => (
              <Reveal as="li" key={study.slug} delay={i * 60}>
                <Link
                  href={caseStudyPath(study.slug)}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
                >
                  <span className="text-xs font-medium tracking-wide text-accent-300 uppercase">
                    {study.client}
                  </span>
                  <span className="mt-3 block text-base font-semibold text-mist-50">
                    {study.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-mist-400">
                    {study.metaDescription}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------------- sideways links ----------------
          Every service page links to the other five. This is what turns
          six orphan pages into a crawlable cluster. */}
      <Section id="other-services">
        <Reveal>
          <h2
            id="other-services-heading"
            className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
          >
            Other things I build
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other, i) => (
            <Reveal as="li" key={other.slug} delay={i * 50}>
              <Link
                href={servicePath(other.slug)}
                className="group flex h-full items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-accent-300">
                  <Icon name={other.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-mist-50">
                    {other.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-mist-400">
                    {other.blurb}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </main>
  );
}
