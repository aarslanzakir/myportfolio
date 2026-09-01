import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton, Section } from "@/components/ui";
import { caseStudies } from "@/lib/case-studies";
import { profile, whatsappUrl } from "@/lib/content";
import {
  abs,
  buildCaseStudyIndexJsonLd,
  caseStudyPath,
  serializeJsonLd,
} from "@/lib/seo";

const title = "Case studies";
const description = `In-depth write-ups of work delivered by ${profile.name}: the problem, the approach and what changed. Web platforms, mobile apps, AI automation and blockchain products.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    type: "website",
    url: abs("/case-studies"),
    title: `${title} | ${profile.name}`,
    description,
  },
};

export default function CaseStudiesIndexPage() {
  /* An index with nothing in it is a worse result than no index at all:
     it gets crawled, indexed as an empty page, and drags on the domain.
     404 until there is at least one study to list. */
  if (caseStudies.length === 0) notFound();

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCaseStudyIndexJsonLd(caseStudies)),
        }}
      />

      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Case studies" }]}
        />

        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
            <span className="size-1.5 rounded-full bg-accent-300" />
            Selected work
          </span>

          <h1 className="mt-6 text-balance text-[2.15rem] leading-[1.08] font-semibold tracking-tight text-mist-50 sm:text-5xl lg:text-[3.25rem]">
            The work, <span className="text-gradient">in full</span>
          </h1>

          <p className="mt-7 text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
            Not a gallery of screenshots. Each of these covers what was
            actually wrong, what I built, why I built it that way, and what
            changed afterwards.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href={whatsappUrl} external icon="whatsapp">
              Start a project
            </PrimaryButton>
            <GhostButton href="/services" icon="layers">
              See services
            </GhostButton>
          </div>
        </Reveal>
      </Section>

      <Section id="all-case-studies">
        <h2 id="all-case-studies-heading" className="sr-only">
          All case studies
        </h2>

        <ul className="grid gap-4 md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <Reveal as="li" key={study.slug} delay={i * 70}>
              <Link
                href={caseStudyPath(study.slug)}
                className="group flex h-full flex-col rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium tracking-wide text-accent-300 uppercase">
                    {study.client}
                  </span>
                  <span className="font-mono text-xs text-mist-500">
                    {study.year}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-mist-50">
                  {study.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-mist-400 sm:text-base">
                  {study.metaDescription}
                </p>

                {study.stack.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {study.stack.slice(0, 5).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-white/[0.09] bg-ink-900/70 px-2 py-0.5 font-mono text-[11px] text-mist-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-accent-300">
                  Read the case study
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </main>
  );
}
