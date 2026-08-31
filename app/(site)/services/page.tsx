import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton, Section } from "@/components/ui";
import { profile, whatsappUrl } from "@/lib/content";
import { services } from "@/lib/services";
import { abs, buildServiceIndexJsonLd, serializeJsonLd, servicePath } from "@/lib/seo";

const title = "Services";
const description = `Web, mobile, AI, blockchain and cloud development by ${profile.name}. ${profile.yearsExperience}+ years across the MERN and MEAN stacks, React Native, Laravel, Python and Web3. Hourly, weekly or fixed price.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: abs("/services"),
    title: `${title} | ${profile.name}`,
    description,
  },
};

export default function ServicesIndexPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildServiceIndexJsonLd()),
        }}
      />

      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Services" }]}
        />

        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-wide text-accent-300 uppercase">
            <span className="size-1.5 rounded-full bg-accent-300" />
            What I do
          </span>

          <h1 className="mt-6 text-balance text-[2.15rem] leading-[1.08] font-semibold tracking-tight text-mist-50 sm:text-5xl lg:text-[3.25rem]">
            Six things I build,{" "}
            <span className="text-gradient">and build properly</span>
          </h1>

          <p className="mt-7 text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
            One person across the whole stack, so nothing falls into the gap
            between an agency&apos;s front-end team and its back-end team. Pick
            the area closest to what you need and you&apos;ll find what it
            covers, what you actually receive, and the work I&apos;ve already
            shipped in it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href={whatsappUrl} external icon="whatsapp">
              Start a project
            </PrimaryButton>
            <GhostButton href="/#work" icon="layers">
              See the work
            </GhostButton>
          </div>
        </Reveal>
      </Section>

      <Section id="all-services">
        <h2 id="all-services-heading" className="sr-only">
          All services
        </h2>

        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal as="li" key={service.slug} delay={i * 70}>
              <Link
                href={servicePath(service.slug)}
                className="group flex h-full flex-col rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] sm:p-8"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-accent-300">
                  <Icon name={service.icon} className="size-5" />
                </span>

                <h3 className="mt-5 text-xl font-semibold text-mist-50">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-mist-400 sm:text-base">
                  {service.blurb}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-lg border border-white/[0.09] bg-ink-900/70 px-2.5 py-1 text-xs text-mist-300"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-accent-300">
                  Read more
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
