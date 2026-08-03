import Icon from "./Icon";
import ProjectGallery from "./ProjectGallery";
import Reveal from "./Reveal";
import { GhostButton, Section, SectionHeading } from "./ui";
import { listProjects, type Project } from "@/lib/store";

/** The first two entries in admin order get large spotlight cards. */
const SPOTLIGHT = 2;

function SpotlightCard({ project }: { project: Project }) {
  const clickable = Boolean(project.link) && !project.privateDemo;

  const body = (
    <article className="group ring-gradient relative flex h-full flex-col overflow-hidden rounded-3xl">
      <span className="ring-gradient-inner" />

      <div className="relative flex h-full flex-col bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-7 transition-transform duration-300 group-hover:-translate-y-1 sm:p-9">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-28 size-72 rounded-full bg-accent-400/25 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium tracking-wide text-accent-300 uppercase">
            <Icon name="sparkles" className="size-3.5" />
            {project.category}
          </span>
          {clickable && (
            <Icon
              name="arrow"
              className="size-5 shrink-0 -rotate-45 text-mist-400 transition-all duration-300 group-hover:rotate-0 group-hover:text-mist-50"
            />
          )}
        </div>

        <h3 className="relative mt-6 text-2xl font-semibold text-mist-50 sm:text-3xl">
          {project.title}
        </h3>

        {project.summary && (
          <p className="relative mt-3.5 text-sm leading-relaxed text-mist-400 sm:text-base">
            {project.summary}
          </p>
        )}

        <div className="relative mt-auto pt-7">
          {project.stack.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-lg border border-white/[0.09] bg-ink-900/70 px-2.5 py-1 font-mono text-xs text-mist-200"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {project.link && (
            <p className="mt-4 truncate font-mono text-xs text-mist-500">
              {project.privateDemo
                ? "Private, demo access on request"
                : project.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </p>
          )}
        </div>
      </div>
    </article>
  );

  return clickable ? (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {body}
    </a>
  ) : (
    body
  );
}

export default async function Projects() {
  const projects = await listProjects();
  const spotlight = projects.slice(0, SPOTLIGHT);
  const rest = projects.slice(SPOTLIGHT);

  return (
    <Section id="work">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title={`${projects.length} projects shipped,`}
          highlight="here's the range"
          blurb="Web platforms, mobile apps on the App Store and Play, multi-chain blockchain products and dozens of business sites. Filter by the stack you care about."
          align="left"
        />
        <Reveal delay={120} className="shrink-0">
          <GhostButton href="#contact" icon="chat">
            Discuss your project
          </GhostButton>
        </Reveal>
      </div>

      {/* ---------- spotlight ---------- */}
      {spotlight.length > 0 && (
        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {spotlight.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 90}>
              <SpotlightCard project={project} />
            </Reveal>
          ))}
        </ul>
      )}

      {/* ---------- everything else ---------- */}
      {rest.length > 0 && (
        <Reveal className="mt-16">
          <ProjectGallery projects={rest} />
        </Reveal>
      )}
    </Section>
  );
}
