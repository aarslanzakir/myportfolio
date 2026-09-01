import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroPhoto from "@/public/mine.png";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton, Section } from "@/components/ui";
import { mailtoUrl, profile, skillGroups, whatsappUrl } from "@/lib/content";
import { services } from "@/lib/services";
import {
  abs,
  buildAboutJsonLd,
  jobTitle,
  serializeJsonLd,
  servicePath,
} from "@/lib/seo";

/**
 * The page that answers a search for the name itself.
 *
 * A name query is the one search this site can realistically win, and it
 * is won by having a page that is unambiguously *about the person*: the
 * name in the title, in the H1 and in the opening sentence, backed by
 * ProfilePage schema pointing at the same Person entity the home page
 * declares. That is what this page is for.
 */

const title = `About ${profile.name}`;
const description = `${profile.name} is a full-stack developer and AI automation engineer with ${profile.yearsExperience}+ years building web platforms, mobile apps and AI systems for clients worldwide. MERN, MEAN, Laravel, Python and Web3.`;

export const metadata: Metadata = {
  /* `absolute` bypasses the root layout's "%s | <name>" template, which
     would otherwise render "About Ali Arslan Zakir | Ali Arslan Zakir". */
  title: { absolute: `${title} | Full-Stack Developer` },
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: abs("/about"),
    title: `${title} | ${jobTitle}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${jobTitle}`,
    description,
  },
};

const facts = [
  { label: "Based in", value: profile.location.split("·")[0].trim() },
  { label: "Time zone", value: profile.timezone },
  { label: "Experience", value: `${profile.yearsExperience}+ years` },
  { label: "Availability", value: "Open to new projects" },
];

export default function AboutPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildAboutJsonLd()),
        }}
      />

      {/* ---------------- header ---------------- */}
      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
              <span className="size-1.5 rounded-full bg-accent-300" />
              About
            </span>

            {/* The name is the H1 here, deliberately. On the home page the
                H1 sells the outcome; this page exists to answer the name. */}
            <h1 className="mt-6 text-balance text-[2.15rem] leading-[1.08] font-semibold tracking-tight text-mist-50 sm:text-5xl lg:text-[3.25rem]">
              {profile.name}
            </h1>

            <p className="mt-4 font-display text-lg text-accent-300 sm:text-xl">
              {jobTitle}
            </p>

            <div className="mt-7 flex flex-col gap-5 text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
              <p>
                I&apos;m {profile.name}, a full-stack developer and AI
                automation engineer with {profile.yearsExperience}+ years of
                experience. I work with clients worldwide from{" "}
                {profile.location.split("·")[0].trim()}, building the software
                their business actually runs on.
              </p>
              <p>
                Most of my work falls into one of two shapes. Either someone
                has an idea and needs it built properly the first time, or
                someone has an existing system that has stopped being possible
                to change and needs rescuing. I do a lot of the second kind,
                and I will tell you honestly when extending something is
                cheaper than rebuilding it, even when rebuilding would pay me
                more.
              </p>
              <p>
                Working with one person across the whole stack means nothing
                falls into the gap between an agency&apos;s front-end team and
                its back-end team. It also means you always know who is
                accountable. You get a written scope and a number before I
                start, a working link every week rather than a status report,
                and documentation at handover so you are never locked into me
                to keep your own product alive.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href={whatsappUrl} external icon="whatsapp">
                Start a project
              </PrimaryButton>
              <GhostButton href={mailtoUrl} icon="mail">
                Email me
              </GhostButton>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.09]">
              <Image
                src={heroPhoto}
                alt={`${profile.name}, ${jobTitle}`}
                sizes="(min-width: 1024px) 32rem, 100vw"
                placeholder="blur"
                className="h-auto w-full object-cover"
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-5 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-medium tracking-[0.14em] text-mist-500 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-mist-100">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- what I do ---------------- */}
      <Section id="what-i-do">
        <Reveal>
          <h2
            id="what-i-do-heading"
            className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
          >
            What {profile.name.split(" ")[0]}{" "}
            <span className="text-gradient">works on</span>
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
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
      </Section>

      {/* ---------------- toolkit ---------------- */}
      <Section id="toolkit">
        <Reveal>
          <h2
            id="toolkit-heading"
            className="text-balance text-3xl leading-[1.15] font-semibold tracking-tight text-mist-50 sm:text-4xl"
          >
            The <span className="text-gradient">toolkit</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.name} delay={i * 50}>
              <h3 className="text-xs font-semibold tracking-[0.14em] text-mist-50 uppercase">
                {group.name}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/[0.09] bg-ink-900/70 px-2 py-0.5 font-mono text-[11px] text-mist-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- contact ---------------- */}
      <Section id="reach-me">
        <Reveal>
          <div className="ring-gradient relative overflow-hidden rounded-3xl">
            <span className="ring-gradient-inner" />
            <div className="relative flex flex-col items-center gap-6 bg-gradient-to-br from-white/[0.07] to-white/[0.015] px-6 py-10 text-center sm:px-10 sm:py-12">
              <h2
                id="reach-me-heading"
                className="text-balance text-2xl font-semibold tracking-tight text-mist-50 sm:text-3xl"
              >
                Work with {profile.name.split(" ")[0]}
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-mist-400">
                A short brief is enough to start. You&apos;ll get an honest
                answer on feasibility, timeline and cost before either of us
                commits to anything.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={whatsappUrl} external icon="whatsapp">
                  Message on WhatsApp
                </PrimaryButton>
                <GhostButton href="/services" icon="layers">
                  See services
                </GhostButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
