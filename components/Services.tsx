import Link from "next/link";
import Icon from "./Icon";
import Reveal from "./Reveal";
import Spotlight from "./Spotlight";
import { Section, SectionHeading } from "./ui";
import { services } from "@/lib/content";
import { servicePath } from "@/lib/seo";

export default function Services() {
  return (
    <Section id="services">
      <SectionHeading
        sectionId="services"
        eyebrow="What I do"
        title="Services built around"
        highlight="shipping, not slideshows"
        blurb="Six areas I work in every week. Most projects combine two or three. Tell me the outcome you need and I'll tell you which parts apply."
        align="left"
      />

      <Spotlight as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal
            as="li"
            key={service.title}
            delay={i * 70}
            className={service.featured ? "sm:col-span-2 lg:col-span-1" : ""}
          >
            <article className="group ring-gradient relative flex h-full flex-col rounded-3xl">
              {service.featured && <span className="ring-gradient-inner" />}

              <div
                className={`spotlight-target relative flex h-full flex-col rounded-3xl p-6 transition-all duration-300 sm:p-7 ${
                  service.featured
                    ? "bg-gradient-to-b from-white/[0.07] to-white/[0.02]"
                    : "border border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14]"
                } hover:-translate-y-1`}
              >
                {/* icon */}
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
                    service.featured
                      ? "bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-ink-950"
                      : "border border-white/10 bg-white/[0.05] text-accent-300"
                  }`}
                >
                  <Icon name={service.icon} className="size-6" />
                </span>

                <h3 className="mt-5 text-lg font-semibold text-mist-50">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-400">
                  {service.blurb}
                </p>

                <ul className="mt-5 space-y-2 border-t border-white/[0.07] pt-5">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2.5 text-sm text-mist-200"
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 size-4 shrink-0 text-accent-300"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* The home page's link into each service page: this is
                    how crawlers reach them and how a visitor gets to the
                    detail without going back to the nav. */}
                <Link
                  href={servicePath(service.slug)}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-accent-300 transition-colors hover:text-accent-200"
                >
                  More on {service.title.toLowerCase()}
                  <Icon
                    name="arrow"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </Spotlight>
    </Section>
  );
}
