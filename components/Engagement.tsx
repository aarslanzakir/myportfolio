import Icon from "./Icon";
import Reveal from "./Reveal";
import { GhostButton, Section, SectionHeading } from "./ui";
import { engagementModels } from "@/lib/content";

export default function Engagement() {
  return (
    <Section id="pricing" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-accent-400/8 blur-[130px]"
      />

      <SectionHeading
        sectionId="pricing"
        eyebrow="Ways to work together"
        title="Hourly, weekly or fixed price,"
        highlight="whichever fits the scope"
        blurb="No single model suits every project, so I offer all three. We pick the one that puts the least risk on you, then agree it in writing before any work starts."
      />

      <ul className="mt-14 grid gap-4 lg:grid-cols-3">
        {engagementModels.map((model, i) => (
          <Reveal as="li" key={model.title} delay={i * 90}>
            <article
              className={`group ring-gradient relative flex h-full flex-col rounded-3xl transition-transform duration-300 hover:-translate-y-1 ${
                model.featured ? "" : ""
              }`}
            >
              {model.featured && <span className="ring-gradient-inner" />}

              <div
                className={`relative flex h-full flex-col rounded-3xl p-7 sm:p-8 ${
                  model.featured
                    ? "bg-gradient-to-b from-white/[0.08] to-white/[0.02]"
                    : "border border-white/[0.07] bg-white/[0.025] group-hover:border-white/[0.14]"
                }`}
              >
                {model.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-ink-950 uppercase">
                    Most popular
                  </span>
                )}

                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
                    model.featured
                      ? "bg-gradient-to-br from-accent-300 via-accent-400 to-ember-400 text-ink-950"
                      : "border border-white/10 bg-white/[0.05] text-accent-300"
                  }`}
                >
                  <Icon name={model.icon} className="size-6" />
                </span>

                <h3 className="mt-5 text-xl font-semibold text-mist-50">
                  {model.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-accent-300">
                  {model.tagline}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-mist-400">
                  {model.body}
                </p>

                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-mist-500 uppercase">
                    Best for
                  </p>
                  <ul className="mt-3 space-y-2">
                    {model.bestFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-mist-200"
                      >
                        <Icon
                          name="check"
                          className="mt-0.5 size-4 shrink-0 text-accent-400"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={200} className="mt-10">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-8 text-center sm:px-10">
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-mist-400 sm:text-base">
            Not sure which model suits your project? Tell me what you&apos;re trying
            to build and I&apos;ll recommend the one that costs you least, even if
            that means a smaller engagement than you expected.
          </p>
          <GhostButton href="#contact" icon="chat">
            Get a recommendation
          </GhostButton>
        </div>
      </Reveal>
    </Section>
  );
}
