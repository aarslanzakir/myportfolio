import Icon from "./Icon";
import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";
import { profile, reasons } from "@/lib/content";

export default function WhyMe() {
  return (
    <Section id="why">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
          sectionId="why"
            eyebrow="Why me"
            title="What you get that an agency"
            highlight="usually charges triple for"
            blurb={`${profile.yearsExperience} years in, the technical part is rarely what makes a project succeed. Communication, honest scoping and a clean handover are.`}
            align="left"
          />
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal as="li" key={reason.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] sm:p-7">
                <span className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-ember-400">
                  <Icon name={reason.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-mist-50">
                  {reason.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-400">
                  {reason.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
