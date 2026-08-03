import Icon from "./Icon";
import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";
import { faqs } from "@/lib/content";

/**
 * Built on native <details>/<summary>: keyboard-accessible, works
 * before hydration, and collapses to one column on small screens.
 */
export default function Faq() {
  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="Before you ask"
        title="The questions clients"
        highlight="always start with"
      />

      <div className="mt-12 grid gap-3">
        {faqs.map((faq, i) => (
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
  );
}
