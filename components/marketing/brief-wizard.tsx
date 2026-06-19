"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { type CompanyBriefPayload } from "@/lib/schemas/company-enquiry";
import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { useCalendlyLead } from "@/lib/analytics/use-calendly-lead";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";
const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// Full skill set — mirrors the navbar "Hire Talent" mega-menu (frontend,
// backend, mobile, devops/cloud) so the brief covers the same options.
const TECH_OPTIONS: { name: string; icon: string }[] = [
  // Frontend
  { name: "React", icon: `${DEVICON}/react/react-original.svg` },
  { name: "Next.js", icon: `${DEVICON}/nextjs/nextjs-original.svg` },
  { name: "Vue.js", icon: `${DEVICON}/vuejs/vuejs-original.svg` },
  { name: "Angular", icon: `${DEVICON}/angularjs/angularjs-original.svg` },
  { name: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
  { name: "JavaScript", icon: `${DEVICON}/javascript/javascript-original.svg` },
  { name: "Tailwind CSS", icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
  { name: "Redux", icon: `${DEVICON}/redux/redux-original.svg` },
  // Backend
  { name: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
  { name: "Python", icon: `${DEVICON}/python/python-original.svg` },
  { name: "Go", icon: `${DEVICON}/go/go-original-wordmark.svg` },
  { name: "Java", icon: `${DEVICON}/java/java-original.svg` },
  { name: "Rust", icon: `${DEVICON}/rust/rust-original.svg` },
  { name: "Django", icon: `${DEVICON}/django/django-plain.svg` },
  { name: "GraphQL", icon: `${DEVICON}/graphql/graphql-plain.svg` },
  // Mobile
  { name: "React Native", icon: `${DEVICON}/react/react-original.svg` },
  { name: "Flutter", icon: `${DEVICON}/flutter/flutter-original.svg` },
  { name: "Swift", icon: `${DEVICON}/swift/swift-original.svg` },
  { name: "Kotlin", icon: `${DEVICON}/kotlin/kotlin-original.svg` },
  // DevOps & Cloud
  { name: "AWS", icon: `${DEVICON}/amazonwebservices/amazonwebservices-plain-wordmark.svg` },
  { name: "Docker", icon: `${DEVICON}/docker/docker-original.svg` },
  { name: "Kubernetes", icon: `${DEVICON}/kubernetes/kubernetes-original.svg` },
  { name: "PostgreSQL", icon: `${DEVICON}/postgresql/postgresql-original.svg` },
];

export const BRIEF_TECH_NAMES = TECH_OPTIONS.map((t) => t.name);

const LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;
const LEVEL_LABEL: Record<string, string> = {
  Junior: "Junior · 0–2 yrs",
  Mid: "Mid · 2–5 yrs",
  Senior: "Senior · 5–8 yrs",
  Lead: "Lead · 8+ yrs",
};
const ENGAGEMENTS = ["Full-time", "Part-time", "Contract"] as const;
const WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;
const TIMELINES = ["ASAP", "2–4 weeks", "1–3 months", "Just exploring"] as const;

const DIAL_CODES = [
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+91", flag: "🇮🇳" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+27", flag: "🇿🇦" },
  { code: "+971", flag: "🇦🇪" },
];

const TOTAL_STEPS = 6;

export interface BriefWizardProps {
  open: boolean;
  onClose: () => void;
  /** Prefilled role title (e.g. "React Developer"). */
  defaultRole?: string;
  /** Suggestion chips for the role step. */
  roleChips?: string[];
  /** Pre-selected tech pills. */
  defaultTech?: string[];
  /** Identifier of the page the wizard was opened from (stored as source). */
  sourcePage?: string;
}

// ── Small styled primitives (match the design's segmented / card controls) ──

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl border border-border bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-[9px] px-2.5 py-2.5 text-[13px] font-medium transition-colors",
            o === value
              ? "bg-card text-pulse shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function BriefWizard({
  open,
  onClose,
  defaultRole = "",
  roleChips = [
    "Senior Software Engineer",
    "Full-Stack Engineer",
    "Frontend Engineer",
    "Backend Engineer",
  ],
  defaultTech = [],
  sourcePage,
}: BriefWizardProps) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Brief state
  const [role, setRole] = useState(defaultRole);
  const [tech, setTech] = useState<string[]>(defaultTech);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Mid");
  const [count, setCount] = useState(1);
  const [engagement, setEngagement] =
    useState<(typeof ENGAGEMENTS)[number]>("Full-time");
  const [workMode, setWorkMode] = useState<(typeof WORK_MODES)[number]>("Remote");
  const [timeline, setTimeline] = useState<(typeof TIMELINES)[number]>("2–4 weeks");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dial, setDial] = useState("+1");

  useCalendlyLead(done);

  // Reset to the prefilled defaults whenever the wizard is (re)opened.
  useEffect(() => {
    if (open) {
      setStep(0);
      setDone(false);
      setApiError(null);
      setRole(defaultRole);
      setTech(defaultTech);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const toggleTech = (t: string) =>
    setTech((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const stepValid = (s: number): boolean => {
    if (s === 0) return role.trim().length > 0;
    if (s === 1) return tech.length > 0;
    if (s === 4)
      return (
        name.trim().length > 0 &&
        company.trim().length > 0 &&
        /.+@.+\..+/.test(email)
      );
    return true;
  };

  const valid = stepValid(step);
  const onReview = step === 5;

  const next = () => {
    if (!stepValid(step)) return;
    if (step < 5) setStep(step + 1);
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setApiError(null);
    const payload: CompanyBriefPayload = {
      contactName: name.trim(),
      companyName: company.trim(),
      email: email.trim(),
      phone: phone.trim() || "0000000",
      website: "", // honeypot
      dialCode: dial,
      role: role.trim(),
      techStack: tech,
      experienceLevel: level,
      teamSize: count,
      engagementType: engagement,
      workMode,
      timeline,
      sourcePage,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        setStep(4);
        setSubmitting(false);
        return;
      }
      trackMetaEvent("Lead", {
        content_name: "Hire Brief",
        content_category: "hire",
      });
      setDone(true);
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "h-[46px] w-full rounded-xl border border-border bg-background/50 px-4 text-[15px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-pulse focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--pulse)_25%,transparent)]";

  return (
    <div
      className="dark fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "color-mix(in oklab, #05070d 72%, transparent)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[580px] flex-col overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-2xl"
      >
        {done ? (
          <div className="flex flex-col items-center overflow-y-auto px-7 py-10 text-center sm:px-10">
            <span className="mb-5 flex size-16 items-center justify-center rounded-full border border-pulse/35 bg-pulse/15 text-pulse">
              <Check className="size-8" strokeWidth={2.4} />
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">Brief submitted</h2>
            <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Yaseen and the matching team are on it. To fast-track your shortlist,
              book a 30-minute intro call below.
            </p>

            <div className="mt-5 w-full rounded-2xl border border-border bg-pulse/[0.04] px-5 py-4 text-left">
              <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Your brief
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <SummaryRow k="Role" v={role || "—"} />
                <SummaryRow k="Stack" v={tech.length ? tech.join(", ") : "—"} />
                <SummaryRow k="Experience" v={LEVEL_LABEL[level]} />
                <SummaryRow k="Team" v={`${count} × ${engagement} · ${workMode}`} />
                <SummaryRow k="Timeline" v={timeline} />
              </div>
            </div>

            <div className="mt-6 w-full text-left">
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-border">
                  <AvatarImage src="/Yaseen Founder.jpg" alt="Yaseen" className="scale-110" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Book your intro call</p>
                  <p className="text-xs text-muted-foreground">
                    30 minutes · No commitment
                  </p>
                </div>
              </div>
              <div
                className="calendly-inline-widget overflow-hidden rounded-2xl border border-border"
                data-url={CALENDLY_URL}
                style={{ minWidth: "100%", height: "620px" }}
              />
              <Script
                src="https://assets.calendly.com/assets/external/widget.js"
                strategy="lazyOnload"
              />
            </div>

            <button
              onClick={onClose}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-secondary px-7 font-mono text-[13px] uppercase tracking-[0.08em] text-foreground transition-opacity hover:opacity-90"
            >
              Back to site
            </button>
          </div>
        ) : (
          <>
            {/* header */}
            <div className="sticky top-0 z-[2] bg-card px-7 pt-6 sm:px-8">
              <div className="mb-3.5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                  Step {step + 1} of {TOTAL_STEPS}
                </span>
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-pulse transition-all duration-300"
                  style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* body */}
            <div className="min-h-[300px] overflow-y-auto px-7 pt-6 sm:px-8">
              {step === 0 && (
                <Fade>
                  <StepTitle title="What role are you hiring for?" sub="Give it a title — be as specific as you like." />
                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior React Engineer"
                    className={cn(inputCls, "mt-5 h-[52px] text-base")}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {roleChips.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setRole(c)}
                        className="h-[34px] rounded-full border border-border px-3.5 text-[13px] text-muted-foreground transition-colors hover:border-pulse/40 hover:text-foreground"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </Fade>
              )}

              {step === 1 && (
                <Fade>
                  <StepTitle
                    title="Which skills matter most?"
                    sub={
                      <>
                        Pick the core stack we should prioritise.{" "}
                        <span className="text-pulse">{tech.length} selected</span>
                      </>
                    }
                  />
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {TECH_OPTIONS.map((t) => {
                      const selected = tech.includes(t.name);
                      return (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => toggleTech(t.name)}
                          className={cn(
                            "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
                            selected
                              ? "border-pulse bg-pulse/15 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <span className="flex size-[18px] items-center justify-center rounded-[5px] bg-white/90 p-0.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={t.icon} alt="" className="max-h-full max-w-full" />
                          </span>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </Fade>
              )}

              {step === 2 && (
                <Fade>
                  <StepTitle title="Experience & team size" sub="How senior, and how many do you need?" />
                  <FieldLabel>Seniority</FieldLabel>
                  <Segmented options={LEVELS} value={level} onChange={setLevel} />
                  <FieldLabel className="mt-6">Number of engineers</FieldLabel>
                  <div className="inline-flex h-[50px] items-center overflow-hidden rounded-xl border border-border bg-background/50">
                    <button
                      type="button"
                      onClick={() => setCount((c) => Math.max(c - 1, 1))}
                      className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-pulse"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-12 text-center font-mono text-lg font-semibold">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCount((c) => Math.min(c + 1, 50))}
                      className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-pulse"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </Fade>
              )}

              {step === 3 && (
                <Fade>
                  <StepTitle title="Engagement & timeline" sub="How do you want to work together, and when?" />
                  <FieldLabel>Engagement type</FieldLabel>
                  <Segmented options={ENGAGEMENTS} value={engagement} onChange={setEngagement} />
                  <FieldLabel className="mt-5">Work mode</FieldLabel>
                  <Segmented options={WORK_MODES} value={workMode} onChange={setWorkMode} />
                  <FieldLabel className="mt-5">When do you need them?</FieldLabel>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TIMELINES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeline(t)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                          t === timeline
                            ? "border-pulse bg-pulse/12 text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Fade>
              )}

              {step === 4 && (
                <Fade>
                  <StepTitle title="Where should we send your matches?" sub="No spam — just your shortlist and a note from Yaseen." />
                  <div className="mt-5 flex flex-col gap-4">
                    <div>
                      <FieldLabel className="mt-0">Full name</FieldLabel>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className={inputCls} />
                    </div>
                    <div>
                      <FieldLabel className="mt-0">Company</FieldLabel>
                      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Labs" className={inputCls} />
                    </div>
                    <div>
                      <FieldLabel className="mt-0">Work email</FieldLabel>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jane@acme.com" className={inputCls} />
                    </div>
                    <div>
                      <FieldLabel className="mt-0">
                        Mobile <span className="font-normal text-muted-foreground">· optional</span>
                      </FieldLabel>
                      <div className="flex gap-2">
                        <select
                          value={dial}
                          onChange={(e) => setDial(e.target.value)}
                          className="h-[46px] rounded-xl border border-border bg-background/50 px-2.5 font-mono text-sm text-foreground outline-none"
                        >
                          {DIAL_CODES.map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.flag} {d.code}
                            </option>
                          ))}
                        </select>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="82 123 4567"
                          className={cn(inputCls, "flex-1")}
                        />
                      </div>
                    </div>
                  </div>
                  {apiError && <p className="mt-3 text-sm text-destructive">{apiError}</p>}
                </Fade>
              )}

              {step === 5 && (
                <Fade>
                  <StepTitle title="Review your brief" sub="Looks good? We'll start matching the moment you submit." />
                  <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                    <ReviewRow k="Role" v={role || "—"} />
                    <ReviewRow k="Tech stack" v={tech.length ? tech.join(", ") : "—"} />
                    <ReviewRow k="Experience" v={LEVEL_LABEL[level]} />
                    <ReviewRow k="Team" v={`${count} × ${engagement} · ${workMode}`} />
                    <ReviewRow k="Timeline" v={timeline} />
                    <ReviewRow
                      k="Contact"
                      v={(name || "—") + (company ? ` · ${company}` : "")}
                      last
                    />
                  </div>
                  {apiError && <p className="mt-3 text-sm text-destructive">{apiError}</p>}
                </Fade>
              )}
            </div>

            {/* footer */}
            <div className="sticky bottom-0 mt-2 flex items-center justify-between gap-3 border-t border-border bg-card px-7 py-5 sm:px-8">
              <button
                onClick={back}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 font-mono text-[13px] uppercase tracking-[0.08em] text-foreground transition-colors",
                  step === 0 ? "invisible" : "visible",
                )}
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <button
                onClick={onReview ? submit : next}
                disabled={!valid || submitting}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full bg-pulse px-6 font-mono text-[13px] uppercase tracking-[0.08em] text-pulse-foreground transition-opacity",
                  valid && !submitting ? "opacity-100" : "cursor-not-allowed opacity-40",
                )}
              >
                {submitting
                  ? "Submitting…"
                  : onReview
                    ? "Submit brief"
                    : step === 4
                      ? "Review brief"
                      : "Continue"}
                {!submitting && <ArrowRight className="size-3.5" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{children}</div>;
}

function StepTitle({ title, sub }: { title: string; sub: React.ReactNode }) {
  return (
    <>
      <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
    </>
  );
}

function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-2.5 mt-5 text-[13px] font-semibold", className)}>{children}</div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

function ReviewRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4 px-4 py-3.5",
        !last && "border-b border-border",
      )}
    >
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="text-right text-sm font-medium">{v}</span>
    </div>
  );
}
