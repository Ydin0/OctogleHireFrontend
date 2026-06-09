"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  GraduationCap,
  Globe,
  MapPin,
  Repeat,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import {
  GAUNTLET_STAGES,
  type Developer,
  type GauntletScores,
  type MarketplaceSettings,
} from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";
import { RateRail } from "./rate-rail";

interface DeveloperProfileProps {
  developer: Developer;
  saved: boolean;
  onSave: (id: string) => void;
  onBack: () => void;
  settings: MarketplaceSettings;
}

function Section({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-border bg-card p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="mb-1.5 text-[10px] font-mono uppercase tracking-wider text-pulse">
            {eyebrow}
          </p>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-px text-pulse">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={cn(
            n <= Math.round(rating)
              ? "fill-pulse text-pulse"
              : "text-pulse/30"
          )}
        />
      ))}
    </span>
  );
}

function GaugeRing({ value, size = 116 }: { value: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--pulse)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold leading-none">{value}</span>
        <span className="mt-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="min-w-[92px] flex-1 rounded-xl border border-border bg-background/60 px-3.5 py-3">
      <span className="mb-1.5 inline-flex items-center gap-1.5 text-pulse">
        {icon}
      </span>
      <div className="font-mono text-lg font-bold leading-none">{value}</div>
      <div className="mt-1 text-[9.5px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function DeveloperProfile({
  developer,
  saved,
  onSave,
  onBack,
  settings,
}: DeveloperProfileProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [developer.id]);

  const firstName = developer.name.split(" ")[0];
  const skills = developer.skillLevels?.length
    ? developer.skillLevels
    : developer.skills.map((name) => ({ name, level: 85 }));
  const gauntlet = developer.gauntlet;

  return (
    <div className="animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="mb-3.5 inline-flex items-center gap-2 py-1.5 font-mono text-[13px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to marketplace
      </button>

      {/* Header */}
      <div className="flex flex-wrap gap-6 rounded-[22px] border border-pulse/30 bg-gradient-to-br from-card to-pulse/5 p-6">
        <div className="w-[196px] shrink-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-border bg-gradient-to-br from-[#1b2540] to-[#0c1120]">
            {developer.avatar && (
              <Image
                src={developer.avatar}
                alt={developer.name}
                fill
                className="object-cover"
                unoptimized
              />
            )}
            <div className="absolute inset-x-3 top-3 flex justify-between gap-1.5">
              {developer.isOnline && (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-black/50 px-2.5 py-1 backdrop-blur">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white">
                    Available
                  </span>
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-black/50 px-2.5 py-1 backdrop-blur">
                <span className="size-1.5 rounded-full bg-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-white">
                  AI Native
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-[280px] flex-1">
          <div className="mb-2.5 flex flex-wrap gap-2">
            {developer.tag && (
              <span className="inline-flex rounded-full border border-pulse/35 bg-pulse/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-pulse">
                {developer.tag} {developer.tagEmoji}
              </span>
            )}
            {gauntlet && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-0.5 text-[11.5px] text-pulse">
                <ShieldCheck className="size-3" /> Gauntlet {gauntlet.overall} ·{" "}
                {gauntlet.percentile}
              </span>
            )}
          </div>
          <h1 className="text-[30px] font-semibold tracking-tight">
            {developer.name}
          </h1>
          <p className="mt-1 text-base font-medium text-pulse">
            {developer.role}
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-[13.5px] text-muted-foreground">
            {developer.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {developer.location}
              </span>
            )}
            {developer.timezone && (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="size-3.5" /> {developer.timezone}
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <StatChip
              icon={<Star className="size-3.5 fill-pulse" />}
              value={developer.rating}
              label="Rating"
            />
            <StatChip
              icon={<Briefcase className="size-3.5" />}
              value={developer.projects}
              label="Projects"
            />
            <StatChip
              icon={<Clock className="size-3.5" />}
              value={`${developer.yearsOfExperience}y`}
              label="Experience"
            />
            {developer.responseTime && (
              <StatChip
                icon={<Zap className="size-3.5" />}
                value={developer.responseTime}
                label="Responds"
              />
            )}
            {developer.repeatHire != null && (
              <StatChip
                icon={<Repeat className="size-3.5" />}
                value={`${developer.repeatHire}%`}
                label="Repeat hire"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* About */}
          <Section eyebrow="About" title={`About ${firstName}`}>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {developer.about || developer.bio}
            </p>
          </Section>

          {/* Gauntlet */}
          {settings.showGauntlet && gauntlet && (
            <Section
              eyebrow="The Octogle Gauntlet"
              title="5-stage AI vetting"
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-0.5 text-xs text-pulse">
                  <ShieldCheck className="size-3.5" /> {gauntlet.percentile}
                </span>
              }
            >
              <div className="mb-5 flex items-center gap-6 border-b border-border pb-5">
                <GaugeRing value={gauntlet.overall} />
                <div>
                  <p className="mb-1 text-[15px] font-semibold">
                    Overall vetting score
                  </p>
                  <p className="max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                    Every OctogleHire engineer clears the same five-stage
                    gauntlet — an AI-scored pipeline harder to pass than a
                    top-tier tech screen. {firstName} ranks in the{" "}
                    <strong className="text-foreground">
                      {gauntlet.percentile.toLowerCase()}
                    </strong>{" "}
                    of all applicants.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3.5">
                {GAUNTLET_STAGES.map((stage, i) => {
                  const score = gauntlet.scores[stage.key as keyof GauntletScores];
                  return (
                    <div key={stage.key} className="flex items-start gap-3.5">
                      <span className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full border border-pulse/35 bg-pulse/15 font-mono text-[11px] font-medium text-pulse">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">
                            {stage.label}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={cn(
                                "font-mono text-[13px] font-semibold",
                                score >= 95 ? "text-emerald-500" : ""
                              )}
                            >
                              {score}
                            </span>
                          </span>
                        </div>
                        <p className="mb-1.5 mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                          {stage.desc}
                        </p>
                        <div className="h-[5px] overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-pulse transition-all duration-700"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Skills */}
          <Section eyebrow="Verified proficiency" title="Tech stack">
            <div className="grid gap-x-7 gap-y-4 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[13.5px] font-medium">
                      {TECH_ICONS[s.name] && (
                        <Image
                          src={TECH_ICONS[s.name]}
                          alt=""
                          width={16}
                          height={16}
                          unoptimized
                        />
                      )}
                      {s.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {s.level >= 90
                        ? "Expert"
                        : s.level >= 80
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-pulse transition-all duration-700"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Experience */}
          {developer.workHistory.length > 0 && (
            <Section eyebrow="Career" title="Work experience">
              <div className="relative pl-6.5">
                <span className="absolute bottom-1 left-[7px] top-1 w-0.5 bg-border" />
                <div className="flex flex-col gap-5.5">
                  {developer.workHistory.map((e, i) => (
                    <div key={i} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[26px] top-1 inline-flex size-4 items-center justify-center rounded-full border-2 bg-card",
                          i === 0 ? "border-pulse" : "border-border"
                        )}
                      >
                        {i === 0 && (
                          <span className="size-1.5 rounded-full bg-pulse" />
                        )}
                      </span>
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <span className="text-[14.5px] font-semibold">
                          {e.role} ·{" "}
                          <span className="text-pulse">{e.company}</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {e.duration}
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                        {e.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {/* Projects */}
          {developer.portfolio && developer.portfolio.length > 0 && (
            <Section eyebrow="Selected work" title="Sample projects">
              <div className="grid gap-3.5 sm:grid-cols-2">
                {developer.portfolio.map((p, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-border bg-background"
                  >
                    <div className="relative flex h-24 items-end bg-gradient-to-br from-pulse/25 to-pulse/5 p-3">
                      <Zap className="absolute right-3 top-3 size-7 text-pulse/25" />
                      <span className="rounded-full border border-white/20 bg-black/35 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white">
                        {p.metric}
                      </span>
                    </div>
                    <div className="p-3.5">
                      <div className="text-sm font-semibold">{p.name}</div>
                      <p className="mb-2.5 mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                        {p.blurb}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Credentials */}
          {(developer.education.length > 0 || developer.awards.length > 0) && (
            <Section eyebrow="Credentials" title="Education & certifications">
              <div className="flex flex-col gap-3">
                {developer.education.map((e, i) => (
                  <div key={`ed${i}`} className="flex items-start gap-3">
                    <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-pulse/10 text-pulse">
                      <GraduationCap className="size-[17px]" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{e.degree}</div>
                      <div className="text-[12.5px] text-muted-foreground">
                        {e.institution}
                        {e.year ? ` · ${e.year}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
                {developer.awards.map((a, i) => (
                  <div key={`aw${i}`} className="flex items-start gap-3">
                    <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-pulse/10 text-pulse">
                      <ShieldCheck className="size-[17px]" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{a.title}</div>
                      <div className="text-[12.5px] text-muted-foreground">
                        {a.issuer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {developer.languages && developer.languages.length > 0 && (
            <Section eyebrow="Communication" title="Languages">
              <div className="flex flex-wrap gap-2.5">
                {developer.languages.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2"
                  >
                    <Globe className="size-3.5 text-pulse" />
                    <span className="text-[13.5px] font-medium">{l.name}</span>
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-muted-foreground">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Reviews */}
          {developer.reviews && developer.reviews.length > 0 && (
            <Section
              eyebrow="Past hires"
              title="What companies say"
              action={
                <span className="inline-flex items-center gap-2">
                  <Stars rating={developer.rating} />
                  <span className="font-mono text-[13px] font-semibold">
                    {developer.rating}
                  </span>
                </span>
              }
            >
              <div className="flex flex-col gap-3.5">
                {developer.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-background p-4.5"
                  >
                    <Stars rating={r.rating} />
                    <p className="my-2.5 text-[14.5px] leading-relaxed">
                      “{r.text}”
                    </p>
                    <div className="flex items-center gap-2.5">
                      {r.authorAvatar && (
                        <Image
                          src={r.authorAvatar}
                          alt={r.author}
                          width={34}
                          height={34}
                          className="size-[34px] rounded-full object-cover"
                          unoptimized
                        />
                      )}
                      <div>
                        <div className="text-[13px] font-semibold">
                          {r.author}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.authorRole}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        <RateRail
          developer={developer}
          saved={saved}
          onSave={onSave}
          settings={settings}
        />
      </div>
    </div>
  );
}

export { DeveloperProfile };
