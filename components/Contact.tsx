import ContactForm from "./ContactForm";
import Icon from "./Icon";
import Reveal from "./Reveal";
import { Section, SectionHeading } from "./ui";
import { mailtoUrl, profile, whatsappUrl } from "@/lib/content";

const channels = [
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: profile.phone,
    href: whatsappUrl,
    hint: "Fastest, usually a reply within a couple of hours",
    accent: "text-emerald-400",
    external: true,
  },
  {
    icon: "mail",
    label: "Email",
    value: profile.email,
    href: mailtoUrl,
    hint: "Best for detailed briefs and attachments",
    accent: "text-accent-300",
    external: false,
  },
  {
    icon: "clock",
    label: "Working hours",
    value: profile.timezone,
    href: null,
    hint: "Overlapping hours with UK, EU, Middle East & US East",
    accent: "text-ember-400",
    external: false,
  },
];

export default function Contact() {
  return (
    <Section id="contact" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-ember-400/12 blur-[130px]"
      />

      <SectionHeading
        sectionId="contact"
        eyebrow="Get in touch"
        title="Tell me what you're building and"
        highlight="I'll tell you what it takes"
        blurb="A short brief is enough to start. You'll get an honest answer on feasibility, timeline and cost before either of us commits to anything."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6">
        {/* direct channels */}
        <Reveal className="flex flex-col gap-4">
          {channels.map((channel) => {
            const inner = (
              <div className="group flex h-full items-start gap-4 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.15] sm:p-6">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] ${channel.accent}`}
                >
                  <Icon name={channel.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wide text-mist-500 uppercase">
                    {channel.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-mist-50 sm:text-base">
                    {channel.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist-500">
                    {channel.hint}
                  </p>
                </div>
                {channel.href && (
                  <Icon
                    name="arrow"
                    className="ml-auto size-4 shrink-0 self-center text-mist-500 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                )}
              </div>
            );

            return channel.href ? (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block"
              >
                {inner}
              </a>
            ) : (
              <div key={channel.label}>{inner}</div>
            );
          })}
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
