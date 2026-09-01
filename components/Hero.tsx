import Image from "next/image";
import heroPhoto from "@/public/mine.png";
import CountUp from "./CountUp";
import Icon from "./Icon";
import Reveal from "./Reveal";
import RotatingWord from "./RotatingWord";
import { GhostButton, PrimaryButton } from "./ui";
import { buildStats, hero, marqueeTech, profile, whatsappUrl } from "@/lib/content";
import { listProjects } from "@/lib/store";

export default async function Hero() {
  // Headline project count stays in sync with whatever is in the admin panel
  const stats = buildStats((await listProjects()).length);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* ------------------------------------------------------------
          Desktop: the photo is a full-bleed banner behind the copy.
          Anchored right so the subject stays in frame and the empty
          dark left side is what gets cropped on wide monitors.
         ------------------------------------------------------------ */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block">
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          quality={95}
          className="object-cover object-[78%_center]"
        />

        {/* Scrims: keep the headline legible without washing out the
            subject on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 from-15% via-ink-950/85 via-45% to-transparent to-75%" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />

        {/* Warm bloom on the copy side, and a vignette to pull the eye in */}
        <div className="aurora absolute inset-0" />
        <div className="vignette absolute inset-0" />

        {/* Gold rim light down the seam where the scrim meets the photo */}
        <div className="absolute inset-y-0 left-[62%] w-px bg-gradient-to-b from-transparent via-accent-400/25 to-transparent" />
      </div>

      {/* Mobile keeps the bloom without the photo behind the text */}
      <div
        aria-hidden="true"
        className="aurora absolute inset-x-0 top-0 -z-10 h-[34rem] lg:hidden"
      />

      <div className="mx-auto w-full max-w-shell px-5 pt-28 sm:px-8 sm:pt-32 lg:min-h-[44rem] lg:px-12 lg:pt-40 xl:min-h-[49rem] xl:px-16 2xl:min-h-[54rem]">
        <div className="flex flex-col items-start lg:max-w-[56%]">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-400/25 bg-ink-950/70 py-2 pr-4 pl-2.5 text-xs font-medium text-mist-200 shadow-[0_8px_30px_-12px_rgba(240,180,41,0.5)] backdrop-blur-md sm:text-sm">
              <span className="relative grid size-4 place-items-center">
                <span className="animate-pulse-ring absolute size-2 rounded-full bg-emerald-400" />
                <span className="size-2 rounded-full bg-emerald-400" />
              </span>
              {hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-[2.4rem] leading-[1.04] font-bold tracking-tight text-mist-50 sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.4rem]">
              {hero.headlinePre} <RotatingWord words={hero.headlineRotating} />
              <br className="hidden sm:block" /> {hero.headlinePost}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-mist-400 sm:text-lg">
              {hero.subline}
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-9 w-full">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton href={whatsappUrl} external icon="whatsapp">
                Start a project
              </PrimaryButton>
              <GhostButton href="/#estimate" icon="sparkles">
                Get an instant estimate
              </GhostButton>
            </div>
          </Reveal>

          <Reveal delay={320} className="mt-8">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist-500">
              <li className="inline-flex items-center gap-2">
                <Icon name="pin" className="size-4 text-accent-400" />
                {profile.location}
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon name="clock" className="size-4 text-accent-400" />
                {profile.timezone}
              </li>
            </ul>
          </Reveal>
        </div>

        {/* ----------------------------------------------------------
            Mobile and tablet: the photo runs in flow beneath the copy
            rather than behind it, so no text sits over the subject's
            face and nothing important gets cropped on a narrow screen.
           ---------------------------------------------------------- */}
        <Reveal delay={200} className="mt-12 lg:hidden">
          <div className="ring-gradient relative rounded-3xl">
            <span className="ring-gradient-inner" />
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src={heroPhoto}
                alt={`${profile.name}, ${profile.role}`}
                sizes="100vw"
                priority
                placeholder="blur"
                quality={90}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent p-5 pt-20">
                <p className="text-base font-semibold text-mist-50">{profile.name}</p>
                <p className="mt-0.5 text-sm text-mist-400">{profile.role}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------- credibility band ---------- */}
      <div className="lit-edge relative mt-14 border-t border-white/[0.07] bg-ink-950/70 backdrop-blur-sm sm:mt-20 lg:mt-24">
        <span className="lit-edge-inner" />
        <dl className="mx-auto grid w-full max-w-shell grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12 xl:px-16">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 70}
              className={`group py-6 lg:py-8 ${
                i > 0 ? "lg:border-l lg:border-white/[0.06] lg:pl-8" : ""
              }`}
            >
              {/* dt before dd keeps the list semantics valid; `order`
                  puts the number above the label visually. */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <dt className="order-2 mt-1.5 text-xs leading-snug text-mist-500 transition-colors duration-300 group-hover:text-mist-400 sm:text-sm">
                  {stat.label}
                </dt>
                <dd className="text-gradient order-1 font-display text-4xl font-bold sm:text-5xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* ---------- tech marquee ---------- */}
      <div className="relative">
        <div className="border-y border-white/[0.07] bg-white/[0.015] py-5">
          <div
            className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
            aria-hidden="true"
          >
            {/* duplicated track so the -50% translate loops seamlessly */}
            <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
              {[...marqueeTech, ...marqueeTech].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="flex shrink-0 items-center gap-10 text-sm font-medium tracking-wide whitespace-nowrap text-mist-500 uppercase"
                >
                  {tech}
                  <span className="size-1 rounded-full bg-accent-400/60" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="sr-only">Technologies I work with: {marqueeTech.join(", ")}.</p>
      </div>
    </section>
  );
}
