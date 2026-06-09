"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Clock,
  Globe,
  GraduationCap,
  MapPin,
  MessageSquare,
  Repeat,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import {
  GAUNTLET_STAGES,
  type Developer,
  type GauntletScores,
} from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Text + layout primitives ────────────────────────────────────────────────

export function Mono({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHead({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-pulse">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}

export function PageScroll({
  children,
  max = 1180,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-background">
      <div
        className="mx-auto px-8 pb-14 pt-7"
        style={{ maxWidth: max }}
      >
        {children}
      </div>
    </div>
  );
}

export function ConsoleSection({
  eyebrow,
  title,
  action,
  children,
  first,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <section className={cn("py-5", !first && "border-t border-border")}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="mb-1.5 text-[9.5px] font-mono uppercase tracking-wider text-pulse">
              {eyebrow}
            </p>
          )}
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Bar({
  label,
  value,
  icon,
  tag,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  tag?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2.5">
        <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[13px] font-medium">
          {icon}
          {label}
        </span>
        {tag != null && (
          <span className="shrink-0 text-[9.5px] font-mono uppercase tracking-wider text-muted-foreground">
            {tag}
          </span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-pulse transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function StatCell({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-border bg-card/50 px-3.5 py-2.5">
      <span className="inline-flex text-pulse">{icon}</span>
      <span className="font-mono text-base font-bold leading-none">{value}</span>
      <Mono className="text-[8.5px] text-muted-foreground">{label}</Mono>
    </div>
  );
}

export function SummaryStat({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[160px] flex-1 items-center gap-3.5 rounded-2xl border p-4",
        accent
          ? "border-pulse/30 bg-gradient-to-br from-pulse/10 to-card"
          : "border-border bg-card",
      )}
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-pulse/12 text-pulse">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-mono text-lg font-bold leading-tight">{value}</div>
        <Mono className="text-[9px] text-muted-foreground">{label}</Mono>
      </div>
    </div>
  );
}

const STATUS_TONES: Record<string, string> = {
  // requirement
  open: "text-pulse border-pulse/35 bg-pulse/10",
  matching: "text-pulse border-pulse/35 bg-pulse/10",
  partially_filled: "text-amber-500 border-amber-500/35 bg-amber-500/10",
  filled: "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
  closed: "text-muted-foreground border-border bg-muted/50",
  // match / engagement / invoice / generic
  proposed: "text-pulse border-pulse/35 bg-pulse/10",
  accepted: "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
  active: "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
  interview_requested: "text-pulse border-pulse/35 bg-pulse/10",
  interview_scheduled: "text-pulse border-pulse/35 bg-pulse/10",
  rejected: "text-muted-foreground border-border bg-muted/50",
  declined: "text-muted-foreground border-border bg-muted/50",
  ended: "text-muted-foreground border-border bg-muted/50",
  pending: "text-amber-500 border-amber-500/35 bg-amber-500/10",
  paid: "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
  sent: "text-pulse border-pulse/35 bg-pulse/10",
  overdue: "text-red-500 border-red-500/35 bg-red-500/10",
  draft: "text-muted-foreground border-border bg-muted/50",
  signed: "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
  "Matches ready": "text-emerald-500 border-emerald-500/35 bg-emerald-500/10",
};

export function StatusPill({ status }: { status: string }) {
  const tone =
    STATUS_TONES[status] ?? "text-muted-foreground border-border bg-muted/50";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
        tone,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-1 text-[11.5px] font-mono uppercase tracking-wider text-pulse">
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-pulse/12 text-pulse">
        {icon}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function MiniRing({
  value,
  size = 44,
}: {
  value: number;
  size?: number;
}) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const tone =
    value >= 85
      ? "var(--color-emerald-500, #34d399)"
      : value >= 65
        ? "var(--pulse)"
        : "var(--muted-foreground)";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-mono text-[13px] font-bold"
          style={{ color: tone }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// Map a lean DeveloperSummary (from a proposed match) into the rich Developer
// shape the detail pane expects. Enrichment fields it lacks (gauntlet, skill
// levels, languages) are left undefined — the pane guards each one.
export function summaryToDeveloper(s: {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  rating: number;
  projects: number;
  hourlyRate: number;
  monthlyRate: number;
  location: string;
  yearsOfExperience: number;
  bio: string;
  about?: string;
  workHistory?: { company: string; role: string; duration: string; description: string }[];
  education?: { institution: string; degree: string; field: string; year: string }[];
  awards?: { title: string; issuer: string; year: string }[];
}): Developer {
  return {
    id: s.id,
    name: s.name,
    role: s.role,
    avatar: s.avatar,
    isOnline: false,
    skills: s.skills,
    rating: s.rating,
    projects: s.projects,
    hourlyRate: s.hourlyRate,
    monthlyRate: s.monthlyRate,
    location: s.location,
    yearsOfExperience: s.yearsOfExperience,
    bio: s.bio,
    about: s.about ?? s.bio,
    workHistory: (s.workHistory ?? []).map((w) => ({
      company: w.company,
      role: w.role,
      duration: w.duration,
      description: w.description,
      techUsed: [],
    })),
    achievements: [],
    education: (s.education ?? []).map((e) => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      year: e.year,
    })),
    awards: s.awards ?? [],
  };
}

// ── Live profile detail pane (translated from console/detail.jsx) ────────────

function Gauge({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--pulse)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold">
        {value}
      </div>
    </div>
  );
}

export function ConsoleDetailPane({
  developer,
  saved,
  onSave,
}: {
  developer: Developer;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [developer.id]);

  const d = developer;
  const firstName = d.name.split(" ")[0];
  const localRate = d.localRate ?? Math.round(d.hourlyRate * 2.2);
  const savePct =
    localRate > 0
      ? Math.round(((localRate - d.hourlyRate) / localRate) * 100)
      : 0;
  const skills = d.skillLevels?.length
    ? d.skillLevels
    : d.skills.map((name) => ({ name, level: 85 }));

  return (
    <div ref={scrollRef} className="h-full min-h-0 overflow-y-auto bg-background">
      {/* header band */}
      <div className="relative border-b border-border bg-gradient-to-br from-pulse/8 to-card px-8 pb-6 pt-7">
        <div className="flex flex-wrap gap-6">
          <div className="relative w-[132px] shrink-0">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#1b2540] to-[#0c1120]">
              {d.avatar && (
                <Image
                  src={d.avatar}
                  alt={d.name}
                  width={132}
                  height={165}
                  className="size-full object-cover"
                  unoptimized
                />
              )}
            </div>
            {d.isOnline && (
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2 py-1 backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <Mono className="text-[8px] text-white">Available</Mono>
              </span>
            )}
          </div>

          <div className="min-w-[240px] flex-1">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {d.tag && (
                <span className="inline-flex rounded-full border border-pulse/35 bg-pulse/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-pulse">
                  {d.tag} {d.tagEmoji}
                </span>
              )}
              {d.gauntlet && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-0.5 text-[11px] text-pulse">
                  <ShieldCheck className="size-3" /> Gauntlet {d.gauntlet.overall}
                </span>
              )}
            </div>
            <h2 className="text-[27px] font-semibold tracking-tight">{d.name}</h2>
            <p className="mt-0.5 text-[15px] font-medium text-pulse">{d.role}</p>
            <div className="mt-2 flex flex-wrap gap-3.5 text-[13px] text-muted-foreground">
              {d.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {d.location}
                </span>
              )}
              {(d.overlap || d.timezone) && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="size-3.5" /> {d.overlap || d.timezone}
                </span>
              )}
            </div>
          </div>

          {/* rate + CTAs */}
          <div className="w-[220px] shrink-0 rounded-2xl border border-pulse/30 bg-card/70 p-4">
            <Mono className="text-[9px] text-pulse">Engagement rate</Mono>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-bold leading-none">
                ${d.hourlyRate}
              </span>
              <span className="text-[13px] text-muted-foreground">/hr</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              ≈ ${d.monthlyRate.toLocaleString()}/mo · full-time
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[9.5px] font-mono uppercase tracking-wider text-emerald-500">
              <TrendingUp className="size-3" /> {savePct}% under local
            </div>
            <div className="mt-3.5 flex flex-col gap-2">
              <Button className="w-full rounded-full">
                <ArrowRight className="size-3.5" /> Request interview
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={() => onSave(d.id)}
                >
                  <Bookmark className={cn("size-3.5", saved && "fill-current")} />{" "}
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full">
                  <MessageSquare className="size-3.5" /> Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* stat strip */}
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2.5">
          <StatCell icon={<Star className="size-3.5 fill-pulse" />} value={d.rating} label="Rating" />
          <StatCell icon={<Briefcase className="size-3.5" />} value={d.projects} label="Projects" />
          <StatCell icon={<Clock className="size-3.5" />} value={`${d.yearsOfExperience}y`} label="Experience" />
          {d.responseTime && (
            <StatCell icon={<Zap className="size-3.5" />} value={d.responseTime} label="Responds" />
          )}
          {d.repeatHire != null && (
            <StatCell icon={<Repeat className="size-3.5" />} value={`${d.repeatHire}%`} label="Repeat hire" />
          )}
        </div>
      </div>

      {/* body sections */}
      <div className="px-8 pb-10">
        <ConsoleSection eyebrow="About" title={`About ${firstName}`} first>
          <p className="text-[14.5px] leading-relaxed text-foreground/90">
            {d.about || d.bio}
          </p>
        </ConsoleSection>

        {d.gauntlet && (
          <ConsoleSection
            eyebrow="The Octogle Gauntlet"
            title="5-stage AI vetting"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-0.5 text-[11.5px] text-pulse">
                <ShieldCheck className="size-3" /> {d.gauntlet.percentile}
              </span>
            }
          >
            <div className="mb-4 flex items-center gap-4">
              <Gauge value={d.gauntlet.overall} />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Cleared the same five-stage gauntlet every OctogleHire engineer
                faces — a pipeline with a ~4% pass rate. {firstName} ranks{" "}
                <strong className="text-foreground">
                  {d.gauntlet.percentile.toLowerCase()}
                </strong>
                .
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {GAUNTLET_STAGES.map((stage) => {
                const score = d.gauntlet!.scores[stage.key as keyof GauntletScores];
                return (
                  <Bar key={stage.key} label={stage.label} value={score} tag={score} />
                );
              })}
            </div>
          </ConsoleSection>
        )}

        <ConsoleSection eyebrow="Verified proficiency" title="Tech stack">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            {skills.map((s) => (
              <Bar
                key={s.name}
                label={s.name}
                value={s.level}
                icon={
                  TECH_ICONS[s.name] && (
                    <Image src={TECH_ICONS[s.name]} alt="" width={15} height={15} unoptimized />
                  )
                }
                tag={s.level >= 90 ? "Expert" : s.level >= 80 ? "Advanced" : "Proficient"}
              />
            ))}
          </div>
        </ConsoleSection>

        {d.workHistory.length > 0 && (
          <ConsoleSection eyebrow="Career" title="Experience">
            <div className="relative pl-5.5">
              <span className="absolute bottom-1 left-[5px] top-1 w-0.5 bg-border" />
              <div className="flex flex-col gap-4.5">
                {d.workHistory.map((e, i) => (
                  <div key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[22px] top-1 size-3 rounded-full border-2 bg-card",
                        i === 0 ? "border-pulse" : "border-border",
                      )}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {e.role} · <span className="text-pulse">{e.company}</span>
                      </span>
                      <Mono className="text-[9.5px] text-muted-foreground">
                        {e.duration}
                      </Mono>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ConsoleSection>
        )}

        {((d.languages && d.languages.length > 0) ||
          d.education.length > 0 ||
          d.awards.length > 0) && (
          <ConsoleSection eyebrow="Communication & credentials" title="Languages & education">
            {d.languages && d.languages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {d.languages.map((l) => (
                  <span
                    key={l.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5"
                  >
                    <Globe className="size-3.5 text-pulse" />
                    <span className="text-[13px] font-medium">{l.name}</span>
                    <Mono className="text-[8.5px] text-muted-foreground">{l.level}</Mono>
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              {d.education.map((e, i) => (
                <div key={`ed${i}`} className="flex items-center gap-3">
                  <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-pulse/12 text-pulse">
                    <GraduationCap className="size-4" />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold">{e.degree}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.institution}
                      {e.year ? ` · ${e.year}` : ""}
                    </div>
                  </div>
                </div>
              ))}
              {d.awards.map((a, i) => (
                <div key={`aw${i}`} className="flex items-center gap-3">
                  <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-pulse/12 text-pulse">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.issuer}</div>
                  </div>
                </div>
              ))}
            </div>
          </ConsoleSection>
        )}
      </div>
    </div>
  );
}

// ── Full-screen profile overlay ──────────────────────────────────────────────

export function ProfileOverlay({
  developer,
  saved,
  onSave,
  onClose,
}: {
  developer: Developer | null;
  saved: boolean;
  onSave: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!developer) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-[min(900px,92vh)] w-[min(1020px,95vw)] overflow-hidden rounded-[20px] border border-border bg-background shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-[5] inline-flex size-9 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur"
        >
          <X className="size-4" />
        </button>
        <ConsoleDetailPane developer={developer} saved={saved} onSave={onSave} />
      </div>
    </div>
  );
}
