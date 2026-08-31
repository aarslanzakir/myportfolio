"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import { profile } from "@/lib/content";
import {
  buildBrief,
  estimate,
  FEATURES,
  PROJECT_TYPES,
  SIZES,
  TIMELINES,
  type Answers,
} from "@/lib/estimator";

const STEPS = ["Project", "Size", "Features", "Timeline"] as const;

const cardBase =
  "group relative flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 " +
  "hover:-translate-y-0.5 focus-visible:-translate-y-0.5";
const cardOff =
  "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]";
const cardOn = "border-accent-400/60 bg-accent-400/10";

export default function Estimator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    type: "",
    size: "",
    features: [],
    timeline: "",
  });

  const result = useMemo(
    () => (step === STEPS.length ? estimate(answers) : null),
    [step, answers],
  );

  /* Features is the only optional step, so it is the only one that can
     advance without a selection. */
  const canAdvance =
    (step === 0 && answers.type) ||
    (step === 1 && answers.size) ||
    step === 2 ||
    (step === 3 && answers.timeline);

  const pick = (key: "type" | "size" | "timeline", value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    // Single-choice steps advance on click: one tap instead of two.
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const toggleFeature = (id: string) =>
    setAnswers((a) => ({
      ...a,
      features: a.features.includes(id)
        ? a.features.filter((f) => f !== id)
        : [...a.features, id],
    }));

  const reset = () => {
    setAnswers({ type: "", size: "", features: [], timeline: "" });
    setStep(0);
  };

  const brief = result ? buildBrief(answers, result) : "";
  const waHref = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(brief)}`;
  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    "Project enquiry from the estimator",
  )}&body=${encodeURIComponent(brief)}`;

  const progress = (Math.min(step, STEPS.length) / STEPS.length) * 100;

  return (
    <div className="ring-gradient relative rounded-3xl">
      <span className="ring-gradient-inner" />

      <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8">
        {/* ---------- progress ---------- */}
        <div className="flex items-center justify-between gap-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`transition-colors duration-300 ${
                    i < step
                      ? "text-accent-300"
                      : i === step
                        ? "font-medium text-mist-50"
                        : "text-mist-500"
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="text-mist-500">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>

          {step > 0 && (
            <button
              onClick={reset}
              className="shrink-0 text-xs text-mist-500 transition-colors hover:text-mist-200"
            >
              Start over
            </button>
          )}
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ---------- steps ---------- */}
        <div className="mt-7">
          {step === 0 && (
            <Step
              title="What do you want built?"
              sub="Pick the closest match. We can refine it on the call."
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PROJECT_TYPES.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => pick("type", t.id)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`${cardBase} ${answers.type === t.id ? cardOn : cardOff} estimator-in`}
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-accent-300 transition-transform duration-200 group-hover:scale-110">
                      <Icon name={t.icon} className="size-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-mist-50">
                        {t.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-mist-500">
                        {t.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="Roughly how big is it?" sub="A gut feel is fine.">
              <div className="grid gap-2.5 sm:grid-cols-3">
                {SIZES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => pick("size", s.id)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`${cardBase} estimator-in flex-col ${
                      answers.size === s.id ? cardOn : cardOff
                    }`}
                  >
                    <span className="text-sm font-medium text-mist-50">{s.label}</span>
                    <span className="text-xs leading-snug text-mist-500">{s.hint}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="Which of these do you need?"
              sub="Select any that apply, or skip if you are not sure yet."
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                {FEATURES.map((f, i) => {
                  const on = answers.features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleFeature(f.id)}
                      aria-pressed={on}
                      style={{ animationDelay: `${i * 35}ms` }}
                      className={`${cardBase} estimator-in items-center ${on ? cardOn : cardOff}`}
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-200 ${
                          on
                            ? "border-accent-400 bg-accent-400 text-ink-950"
                            : "border-white/20 bg-transparent text-transparent"
                        }`}
                      >
                        <Icon name="check" className="size-3.5" />
                      </span>
                      <span className="text-sm text-mist-200">{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step title="When do you need it?" sub="This changes the shape of the plan.">
              <div className="grid gap-2.5 sm:grid-cols-3">
                {TIMELINES.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => pick("timeline", t.id)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={`${cardBase} estimator-in flex-col ${
                      answers.timeline === t.id ? cardOn : cardOff
                    }`}
                  >
                    <span className="text-sm font-medium text-mist-50">{t.label}</span>
                    <span className="text-xs leading-snug text-mist-500">{t.hint}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {/* ---------- result ---------- */}
          {result && (
            <div className="estimator-in">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-[0.12em] text-accent-300 uppercase">
                    Your estimate
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold text-mist-50 sm:text-5xl">
                    <span className="text-gradient">
                      {result.minWeeks} to {result.maxWeeks}
                    </span>{" "}
                    <span className="text-2xl font-semibold text-mist-400 sm:text-3xl">
                      weeks
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.09] bg-white/[0.03] px-4 py-3">
                  <p className="text-[0.65rem] tracking-wide text-mist-500 uppercase">
                    Best fit
                  </p>
                  <p className="mt-0.5 text-lg font-semibold text-mist-50">
                    {result.model.title}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-mist-400">
                {result.model.why}
              </p>

              {/* phase bars */}
              <div className="mt-7">
                <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-mist-500 uppercase">
                  How the time splits
                </p>
                <ul className="mt-3 space-y-2.5">
                  {result.phases.map((phase, i) => {
                    const max = Math.max(...result.phases.map((p) => p.weeks));
                    return (
                      <li key={phase.name} className="flex items-center gap-3">
                        <span className="w-40 shrink-0 truncate text-sm text-mist-200 sm:w-56">
                          {phase.name}
                        </span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <span
                            className="estimator-bar block h-full rounded-full bg-gradient-to-r from-accent-400 to-ember-400"
                            style={{
                              width: `${(phase.weeks / max) * 100}%`,
                              animationDelay: `${i * 90}ms`,
                            }}
                          />
                        </span>
                        <span className="w-14 shrink-0 text-right font-mono text-xs text-mist-500">
                          {phase.weeks}w
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* stack */}
              <div className="mt-7">
                <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-mist-500 uppercase">
                  Likely stack
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {result.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-lg border border-white/[0.09] bg-ink-900/70 px-2.5 py-1 font-mono text-xs text-mist-200"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {result.notes.length > 0 && (
                <ul className="mt-7 space-y-2 border-t border-white/[0.07] pt-5">
                  {result.notes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-mist-400"
                    >
                      <Icon
                        name="sparkles"
                        className="mt-0.5 size-4 shrink-0 text-accent-400"
                      />
                      {note}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-3.5 text-sm font-medium text-ink-950 shadow-[0_10px_36px_-10px_rgba(240,180,41,0.45)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                >
                  <Icon name="whatsapp" className="size-4" />
                  Send this brief on WhatsApp
                </a>
                <a
                  href={mailHref}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-mist-200 transition-all duration-300 hover:border-white/25 hover:text-white active:scale-[0.98]"
                >
                  <Icon name="mail" className="size-4" />
                  Email it instead
                </a>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-mist-500">
                An estimate, not a quote. The real number comes after a short call,
                and it is free either way.
              </p>
            </div>
          )}
        </div>

        {/* ---------- nav ---------- */}
        {step < STEPS.length && (
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-mist-400 transition-colors hover:text-mist-50 disabled:pointer-events-none disabled:opacity-30"
            >
              <Icon name="arrow" className="size-4 rotate-180" />
              Back
            </button>

            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-300 via-accent-400 to-ember-400 px-6 py-3 text-sm font-medium text-ink-950 transition-all duration-300 hover:brightness-110 disabled:pointer-events-none disabled:opacity-30"
            >
              {step === 2 && answers.features.length === 0 ? "Skip" : "Continue"}
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-mist-50 sm:text-xl">{title}</h3>
      <p className="mt-1 text-sm text-mist-500">{sub}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
