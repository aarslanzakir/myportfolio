import Estimator from "./Estimator";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";

const points = [
  {
    icon: "clock",
    title: "Answer four questions",
    body: "Takes about thirty seconds. No email gate, no form to fill in first.",
  },
  {
    icon: "layers",
    title: "See the phase breakdown",
    body: "Where the weeks actually go, so the number is something you can sanity-check rather than just trust.",
  },
  {
    icon: "shield",
    title: "Get the right pricing model",
    body: "Hourly, weekly or fixed. It recommends whichever puts the least risk on you, not the most money on me.",
  },
];

export default function EstimatorSection() {
  return (
    <Section id="estimate" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 size-[38rem] -translate-x-1/2 rounded-full bg-accent-400/8 blur-[130px]"
      />

      <SectionHeading
        sectionId="estimate"
        eyebrow="Instant estimate"
        title="Know the timeline"
        highlight="before you even message me"
        blurb="Most developers make you book a call to find out roughly what your project takes. This does it in the browser, in about thirty seconds, and hands you a brief you can send straight over."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-col gap-6">
            {points.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-accent-300">
                  <Icon name={point.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-mist-50">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-400">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <Estimator />
        </Reveal>
      </div>
    </Section>
  );
}
