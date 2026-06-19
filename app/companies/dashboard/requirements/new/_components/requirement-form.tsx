"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Linkedin,
  Loader2,
  Sparkles,
  ArrowRight,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type { UseFormSetValue } from "react-hook-form";
import {
  jobRequirementSchema,
  type JobRequirementFormData,
} from "@/lib/schemas/job-requirement";
import { TIMEZONE_OPTIONS } from "@/lib/constants/timezones";
import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import { CURRENCIES } from "@/lib/data/currencies";
import {
  createJobRequirement,
  updateJobRequirement,
  fetchLinkedInJobs,
  parseLinkedInJob,
  parseJobDocument,
  type LinkedInJob,
  type ParsedJobData,
  type CreateJobRequirementPayload,
} from "@/lib/api/companies";
import { yearsToLevel } from "@/lib/utils/experience";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";
import { CountrySelector } from "@/components/country-selector";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ALLOWED_TECH_SET = new Set(MARKETPLACE_TECH_STACK_OPTIONS);

// ── Console form primitives ───────────────────────────────────────────────
const INPUT_CLS = "h-12 rounded-xl text-[15px]";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <Label className="text-sm font-semibold">
        {label}
        {hint && <span className="ml-1.5 font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Stepper({
  value,
  onInc,
  onDec,
}: {
  value: number | string;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex h-12 items-center rounded-xl border border-border bg-background/55 pl-4 pr-2">
      <span className="flex-1 font-mono text-base font-medium">{value}</span>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onInc}
          className="flex h-[18px] w-[30px] items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-pulse hover:text-pulse"
        >
          <ChevronUp className="size-3" strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={onDec}
          className="flex h-[18px] w-[30px] items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-pulse hover:text-pulse"
        >
          <ChevronDown className="size-3" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-2xl border border-border bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-[9px] px-3 py-2 text-[13px] font-medium transition-colors",
            value === o.value
              ? "bg-card text-pulse shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function prefillForm(
  parsed: ParsedJobData,
  setValue: UseFormSetValue<JobRequirementFormData>,
) {
  if (parsed.title) setValue("title", parsed.title, { shouldValidate: true });
  if (parsed.techStack?.length) {
    // Only keep values that exist in the canonical tech stack list
    const filtered = parsed.techStack.filter((t) => ALLOWED_TECH_SET.has(t));
    setValue("techStack", filtered, { shouldValidate: true });
  }
  if (parsed.experienceYearsMin != null)
    setValue("experienceYearsMin", parsed.experienceYearsMin, { shouldValidate: true });
  if (parsed.experienceYearsMax != null)
    setValue("experienceYearsMax", parsed.experienceYearsMax, { shouldValidate: true });
  if (parsed.developersNeeded)
    setValue("developersNeeded", parsed.developersNeeded, { shouldValidate: true });
  if (parsed.engagementType)
    setValue("engagementType", parsed.engagementType as JobRequirementFormData["engagementType"], { shouldValidate: true });
  if (parsed.timezonePreference)
    setValue("timezonePreference", parsed.timezonePreference as JobRequirementFormData["timezonePreference"], { shouldValidate: true });
  if (parsed.hiringCountries?.length)
    setValue("hiringCountries", parsed.hiringCountries, { shouldValidate: true });
  if (parsed.budgetMin)
    setValue("budgetMin", String(parsed.budgetMin), { shouldValidate: true });
  if (parsed.budgetMax)
    setValue("budgetMax", String(parsed.budgetMax), { shouldValidate: true });
  if (parsed.description)
    setValue("description", parsed.description, { shouldValidate: true });
  if (parsed.startDate)
    setValue("startDate", parsed.startDate, { shouldValidate: true });
  if (parsed.priority)
    setValue("priority", parsed.priority as JobRequirementFormData["priority"], { shouldValidate: true });
  if (parsed.city)
    setValue("city", parsed.city, { shouldValidate: true });
  if (parsed.workMode)
    setValue("workMode", parsed.workMode as JobRequirementFormData["workMode"], { shouldValidate: true });
  if (parsed.budgetCurrency)
    setValue("budgetCurrency", parsed.budgetCurrency, { shouldValidate: true });
}

interface RequirementFormProps {
  mode?: "create" | "edit";
  requirementId?: string;
  initialValues?: Partial<JobRequirementFormData>;
}

const RequirementForm = ({ mode = "create", requirementId, initialValues }: RequirementFormProps) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const isEdit = mode === "edit";

  // Import mode toggle
  const [importMode, setImportMode] = useState<"linkedin" | "document" | null>(null);

  // LinkedIn import state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinJobs, setLinkedinJobs] = useState<LinkedInJob[]>([]);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [parsingJob, setParsingJob] = useState<string | null>(null);

  // Document upload state
  const [parsingDoc, setParsingDoc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobRequirementFormData>({
    resolver: zodResolver(jobRequirementSchema),
    defaultValues: {
      techStack: [],
      hiringCountries: [],
      city: "",
      workMode: "remote",
      experienceYearsMin: 3,
      experienceYearsMax: 5,
      developersNeeded: 1,
      engagementType: "full-time",
      timezonePreference: "any",
      priority: "medium",
      budgetType: "hourly",
      budgetCurrency: "USD",
      ...initialValues,
    },
  });

  const techStack = watch("techStack");
  const hiringCountries = watch("hiringCountries");
  const description = watch("description");
  const yearsMin = watch("experienceYearsMin");
  const yearsMax = watch("experienceYearsMax");
  const budgetType = watch("budgetType");
  const budgetCurrency = watch("budgetCurrency");
  const developersNeeded = watch("developersNeeded");
  const engagementType = watch("engagementType");
  const timezonePreference = watch("timezonePreference");
  const priority = watch("priority");
  const workMode = watch("workMode");

  const budgetLabel =
    budgetType === "annual" ? "/yr" : budgetType === "monthly" ? "/mo" : "/hr";

  const derivedLevel =
    yearsMin != null && yearsMax != null && yearsMax >= yearsMin
      ? yearsToLevel(yearsMin, yearsMax)
      : null;

  // ── LinkedIn import handlers ────────────────────────────────────────────

  const handleFetchJobs = async () => {
    if (!linkedinUrl.includes("linkedin.com/company/")) return;
    setFetchingJobs(true);
    try {
      const token = await getToken();
      const jobs = await fetchLinkedInJobs(token, linkedinUrl);
      setLinkedinJobs(jobs);
    } catch {
      toast.error("Failed to fetch LinkedIn jobs");
    } finally {
      setFetchingJobs(false);
    }
  };

  const handleSelectJob = async (job: LinkedInJob) => {
    setParsingJob(job.externalId as string);
    try {
      const token = await getToken();
      const parsed = await parseLinkedInJob(token, {
        title: job.title,
        description: job.description,
        descriptionHtml: job.descriptionHtml,
        location: job.location,
        employmentType: job.employmentType,
      });
      prefillForm(parsed, setValue);
      setLinkedinJobs([]);
      toast.success("Job imported from LinkedIn");
    } catch {
      toast.error("Failed to parse LinkedIn job");
    } finally {
      setParsingJob(null);
    }
  };

  // ── Document upload handler ─────────────────────────────────────────────

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsingDoc(true);
    try {
      const token = await getToken();
      const parsed = await parseJobDocument(token, file);
      prefillForm(parsed, setValue);
      toast.success("Document parsed successfully");
    } catch {
      toast.error("Failed to parse document");
    } finally {
      setParsingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Form submit ─────────────────────────────────────────────────────────

  const onSubmit = async (data: JobRequirementFormData) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      const derivedExperienceLevel = yearsToLevel(
        data.experienceYearsMin,
        data.experienceYearsMax,
      );
      const payload: CreateJobRequirementPayload = {
        ...data,
        experienceLevel: derivedExperienceLevel,
        experienceYearsMin: data.experienceYearsMin,
        experienceYearsMax: data.experienceYearsMax,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
        budgetType: data.budgetType,
        budgetCurrency: data.budgetCurrency,
        city: data.city?.trim() || null,
        workMode: data.workMode,
      };
      if (isEdit && requirementId) {
        await updateJobRequirement(token, requirementId, payload);
        toast.success("Requirement updated");
        router.push(`/companies/dashboard/requirements/${requirementId}`);
      } else {
        await createJobRequirement(token, payload);
        toast.success("Requirement created");
        router.push("/companies/dashboard/requirements");
      }
    } catch {
      toast.error(isEdit ? "Failed to update requirement" : "Failed to create requirement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-[42px] rounded-full"
          asChild
        >
          <Link href={isEdit && requirementId ? `/companies/dashboard/requirements/${requirementId}` : "/companies/dashboard/requirements"}>
            <ArrowLeft className="size-[18px]" />
          </Link>
        </Button>
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
            {isEdit ? "Edit requirement" : "Post a new requirement"}
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {isEdit
              ? "Update the details for this requirement."
              : "Describe the role and we\u2019ll match you with engineers in 48 hours."}
          </p>
        </div>
      </div>

      {/* ── Import Methods ─────────────────────────────────────────────── */}
      {!isEdit && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-[18px] text-pulse" />
              <h2 className="text-[17px] font-semibold tracking-tight">Quick import</h2>
              <span className="rounded-full border border-pulse/30 bg-pulse/12 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-pulse">
                AI
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Save time by importing an existing job description — AI parses and pre-fills the form for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {/* LinkedIn Option */}
            <button
              type="button"
              onClick={() => setImportMode(importMode === "linkedin" ? null : "linkedin")}
              className={cn(
                "group relative flex flex-col items-start gap-3.5 rounded-2xl border bg-gradient-to-b from-card to-pulse/[0.04] p-[22px] text-left transition-all hover:-translate-y-0.5 hover:border-pulse/45",
                importMode === "linkedin" ? "border-pulse/45" : "border-border",
              )}
            >
              <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-secondary">
                <Linkedin className="size-6 text-[#0A66C2]" />
              </span>
              <div>
                <p className="text-base font-semibold">Import from LinkedIn</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Paste your company LinkedIn URL and pick from your active job listings. AI extracts every detail instantly.
                </p>
              </div>
              <ArrowRight
                className={cn(
                  "absolute right-5 top-5 size-[18px] transition-transform",
                  importMode === "linkedin"
                    ? "rotate-90 text-pulse"
                    : "text-muted-foreground/50 group-hover:translate-x-0.5",
                )}
              />
            </button>

            {/* PDF / Document Option */}
            <button
              type="button"
              onClick={() => setImportMode(importMode === "document" ? null : "document")}
              className={cn(
                "group relative flex flex-col items-start gap-3.5 rounded-2xl border bg-gradient-to-b from-card to-pulse/[0.04] p-[22px] text-left transition-all hover:-translate-y-0.5 hover:border-pulse/45",
                importMode === "document" ? "border-pulse/45" : "border-border",
              )}
            >
              <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-secondary">
                <FileText className="size-[23px] text-foreground" />
              </span>
              <div>
                <p className="text-base font-semibold">Upload a job description</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Drop a PDF, DOCX, or TXT and let AI parse the role, tech stack, and experience level in seconds.
                </p>
              </div>
              <ArrowRight
                className={cn(
                  "absolute right-5 top-5 size-[18px] transition-transform",
                  importMode === "document"
                    ? "rotate-90 text-pulse"
                    : "text-muted-foreground/50 group-hover:translate-x-0.5",
                )}
              />
            </button>
          </div>

          {/* LinkedIn Expanded Panel */}
          {importMode === "linkedin" && (
            <Card className="border-[#0A66C2]/20">
              <CardContent className="space-y-4 pt-5">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.linkedin.com/company/acme/"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={fetchingJobs || !linkedinUrl.includes("linkedin.com/company/")}
                    onClick={handleFetchJobs}
                    className="gap-1.5"
                  >
                    {fetchingJobs ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Linkedin className="size-3.5" />
                    )}
                    Fetch Jobs
                  </Button>
                </div>

                {fetchingJobs && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" />
                    Fetching jobs from LinkedIn... This may take 30-60 seconds.
                  </div>
                )}

                {linkedinJobs.length > 0 && (
                  <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-2">
                    {linkedinJobs.map((job) => (
                      <button
                        key={job.externalId || job.title}
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-border/50 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                        disabled={parsingJob === job.externalId}
                        onClick={() => handleSelectJob(job)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{job.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {[job.location, job.employmentType].filter(Boolean).join(" \u00b7 ")}
                          </p>
                        </div>
                        {parsingJob === job.externalId ? (
                          <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                        ) : (
                          <ArrowRight className="ml-2 size-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {!fetchingJobs && linkedinJobs.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Paste your company&apos;s LinkedIn URL above and click &ldquo;Fetch Jobs&rdquo; to see active listings.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Upload Expanded Panel */}
          {importMode === "document" && (
            <Card>
              <CardContent className="pt-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleDocUpload}
                  disabled={parsingDoc}
                  className="hidden"
                />

                {parsingDoc ? (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Parsing your document...</p>
                      <p className="text-xs text-muted-foreground">AI is extracting role details, tech stack, and requirements.</p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed py-10 transition-colors hover:border-foreground/20 hover:bg-muted/30"
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <Upload className="size-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload your job description</p>
                      <p className="text-xs text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
                    </div>
                  </button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── "Or fill it in manually" divider ───────────────────────────── */}
      {!isEdit && (
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Or fill it in manually
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      )}

      {/* ── Manual Form ────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-7 py-6">
            <h2 className="text-lg font-semibold tracking-tight">Requirement details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The more precise the brief, the faster we match. Our team starts sourcing once submitted.
            </p>
          </div>

          <div className="space-y-7 px-7 py-7">
            <Field label="Role title" error={errors.title?.message}>
              <Input
                id="title"
                placeholder="e.g. Senior React Engineer"
                className={INPUT_CLS}
                {...register("title")}
              />
            </Field>

            <Field label="Tech stack" error={errors.techStack?.message}>
              <TechStackSelector
                value={techStack}
                onChange={(val) =>
                  setValue("techStack", val, { shouldValidate: true })
                }
                max={20}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field
                label="Min experience"
                hint="years"
                error={errors.experienceYearsMin?.message}
              >
                <Stepper
                  value={yearsMin ?? 0}
                  onInc={() => {
                    const next = Math.min((yearsMin ?? 0) + 1, 50);
                    setValue("experienceYearsMin", next, { shouldValidate: true });
                    if ((yearsMax ?? 0) < next)
                      setValue("experienceYearsMax", next, { shouldValidate: true });
                  }}
                  onDec={() =>
                    setValue("experienceYearsMin", Math.max((yearsMin ?? 0) - 1, 0), {
                      shouldValidate: true,
                    })
                  }
                />
              </Field>

              <Field
                label="Max experience"
                hint="years"
                error={errors.experienceYearsMax?.message}
              >
                <Stepper
                  value={yearsMax ?? 0}
                  onInc={() =>
                    setValue("experienceYearsMax", Math.min((yearsMax ?? 0) + 1, 50), {
                      shouldValidate: true,
                    })
                  }
                  onDec={() =>
                    setValue(
                      "experienceYearsMax",
                      Math.max((yearsMax ?? 0) - 1, yearsMin ?? 0),
                      { shouldValidate: true },
                    )
                  }
                />
              </Field>

              <Field label="Developers needed">
                <Stepper
                  value={developersNeeded ?? 1}
                  onInc={() =>
                    setValue("developersNeeded", Math.min((developersNeeded ?? 1) + 1, 10), {
                      shouldValidate: true,
                    })
                  }
                  onDec={() =>
                    setValue("developersNeeded", Math.max((developersNeeded ?? 1) - 1, 1), {
                      shouldValidate: true,
                    })
                  }
                />
              </Field>
            </div>

            {derivedLevel && (
              <div className="-mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-pulse" />
                Matches{" "}
                <span className="font-medium text-foreground">
                  {derivedLevel.charAt(0).toUpperCase() + derivedLevel.slice(1)}
                </span>{" "}
                level engineers
              </div>
            )}

            <Field label="Engagement type">
              <Segmented<JobRequirementFormData["engagementType"]>
                value={engagementType}
                onChange={(v) => setValue("engagementType", v, { shouldValidate: true })}
                options={[
                  { value: "full-time", label: "Full-Time" },
                  { value: "part-time", label: "Part-Time" },
                  { value: "contract", label: "Contract" },
                  { value: "project-based", label: "Project-Based" },
                ]}
              />
            </Field>

            <Field label="Work mode" error={errors.workMode?.message}>
              <Segmented<JobRequirementFormData["workMode"]>
                value={workMode}
                onChange={(v) => setValue("workMode", v, { shouldValidate: true })}
                options={[
                  { value: "remote", label: "Remote" },
                  { value: "office", label: "Office" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Timezone preference">
                <Select
                  value={timezonePreference}
                  onValueChange={(val) =>
                    setValue(
                      "timezonePreference",
                      val as JobRequirementFormData["timezonePreference"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="timezonePreference" className={INPUT_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority">
                <Select
                  value={priority}
                  onValueChange={(val) =>
                    setValue(
                      "priority",
                      val as JobRequirementFormData["priority"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="priority" className={INPUT_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field
              label="Hiring countries"
              hint="required"
              error={errors.hiringCountries?.message}
            >
              <CountrySelector
                value={hiringCountries}
                onChange={(codes) =>
                  setValue("hiringCountries", codes, { shouldValidate: true })
                }
              />
            </Field>

            <Field
              label="City"
              hint="optional"
            >
              <Input
                id="city"
                placeholder="e.g. Pune, London, San Francisco"
                className={INPUT_CLS}
                {...register("city")}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank for fully remote roles, or enter the office city.
              </p>
            </Field>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Field label="Currency">
                <Select
                  value={budgetCurrency}
                  onValueChange={(v) =>
                    setValue("budgetCurrency", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className={INPUT_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} — {c.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Budget type">
                <Select
                  value={budgetType}
                  onValueChange={(v) =>
                    setValue("budgetType", v as "hourly" | "monthly" | "annual", { shouldValidate: true })
                  }
                >
                  <SelectTrigger className={INPUT_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={`Budget min`} hint={`${budgetLabel}`}>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="e.g. 60"
                  className={cn(INPUT_CLS, "font-mono")}
                  {...register("budgetMin")}
                />
              </Field>
              <Field label={`Budget max`} hint={`${budgetLabel}`}>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="e.g. 120"
                  className={cn(INPUT_CLS, "font-mono")}
                  {...register("budgetMax")}
                />
              </Field>
            </div>

            <Field label="Description" error={errors.description?.message}>
              <MarkdownEditor
                value={description ?? ""}
                onChange={(val) =>
                  setValue("description", val, { shouldValidate: true })
                }
              />
            </Field>

            <Field label="Start date" error={errors.startDate?.message}>
              <DatePicker
                value={watch("startDate") ? new Date(watch("startDate") + "T00:00:00") : undefined}
                onChange={(d) => setValue("startDate", d ? d.toISOString().split("T")[0] : "", { shouldValidate: true })}
              />
            </Field>
          </div>

          {/* footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-7 py-5">
            <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <Sparkles className="size-4 text-pulse" />
              Avg 3–5 matched profiles within 48 hours
            </span>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href={isEdit && requirementId ? `/companies/dashboard/requirements/${requirementId}` : "/companies/dashboard/requirements"}>
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 rounded-full bg-pulse text-pulse-foreground hover:bg-pulse/90"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Post requirement"}
                {!submitting && <ArrowRight className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export { RequirementForm };
