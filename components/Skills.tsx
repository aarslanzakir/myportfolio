import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";
import { skillGroups } from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills" className="overflow-hidden">
      {/* soft centre glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/10 blur-[130px]"
      />

      <SectionHeading
        eyebrow="Toolkit"
        title="Eight years of stack, kept"
        highlight="current on purpose"
        blurb="I pick tools to fit the problem and your team's ability to maintain it afterwards, not because something is trending this quarter."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skillGroups.map((group, i) => (
          <Reveal as="div" key={group.name} delay={i * 60}>
            <div className="group h-full rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-colors duration-300 hover:border-white/[0.14]">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-accent-300/60 to-transparent" />
                <h3 className="text-xs font-semibold tracking-[0.14em] text-mist-50 uppercase">
                  {group.name}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-l from-ember-400/60 to-transparent" />
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-white/[0.07] bg-ink-900/70 px-3 py-1.5 text-sm text-mist-200 transition-colors duration-200 hover:border-accent-300/40 hover:text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
