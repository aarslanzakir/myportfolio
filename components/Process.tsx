import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";
import { processSteps } from "@/lib/content";

export default function Process() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow="How we'd work"
        title="A process designed to remove"
        highlight="your risk"
        blurb="Hiring a developer remotely is a leap of faith. These four steps exist so you always know what's happening, what it costs, and what you get."
        align="left"
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 90}
            className="relative bg-ink-950"
          >
            <div className="group h-full bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.05] sm:p-7">
              <div className="flex items-baseline gap-3">
                <span className="text-gradient font-mono text-3xl font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent"
                />
              </div>

              <h3 className="mt-5 text-base font-semibold text-mist-50">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mist-400">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
