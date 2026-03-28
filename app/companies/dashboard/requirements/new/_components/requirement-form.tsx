"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const ALLOWED_TECH_SET = new Set(MARKETPLACE_TECH_STACK_OPTIONS);

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
      experienceYearsMin: 3,
      experienceYearsMax: 5,
      developersNeeded: 1,
      engagementType: "full-time",
      timezonePreference: "any",
      priority: "medium",
      budgetType: "hourly",
      ...initialValues,
    },
  });

  const techStack = watch("techStack");
  const hiringCountries = watch("hiringCountries");
  const description = watch("description");
  const yearsMin = watch("experienceYearsMin");
  const yearsMax = watch("experienceYearsMax");
  const budgetType = watch("budgetType");
  const developersNeeded = watch("developersNeeded");
  const engagementType = watch("engagementType");
  const timezonePreference = watch("timezonePreference");
  const priority = watch("priority");

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
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href={isEdit && requirementId ? `/companies/dashboard/requirements/${requirementId}` : "/companies/dashboard/requirements"}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{isEdit ? "Edit Requirement" : "Post New Requirement"}</h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Update the details for this requirement." : "Describe the role and we\u2019ll match you with engineers."}
          </p>
        </div>
      </div>

      {/* ── Import Methods ─────────────────────────────────────────────── */}
      {!isEdit && (
        <div className="space-y-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="size-4" />
              Quick Import
            </h2>
            <p className="text-sm text-muted-foreground">
              Save time by importing an existing job description. AI will parse and pre-fill the form for you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* LinkedIn Option */}
            <button
              type="button"
              onClick={() => setImportMode(importMode === "linkedin" ? null : "linkedin")}
              className={`group relative flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                importMode === "linkedin"
                  ? "border-[#0A66C2] bg-[#0A66C2]/[0.03]"
                  : "border-border hover:border-[#0A66C2]/40 hover:bg-muted/30"
              }`}
            >
              <div className={`flex size-11 items-center justify-center rounded-lg ${
                importMode === "linkedin" ? "bg-[#0A66C2]/10" : "bg-muted"
              }`}>
                <Linkedin className={`size-5 ${importMode === "linkedin" ? "text-[#0A66C2]" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold">Import from LinkedIn</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Paste your company LinkedIn URL and select from your active job listings. AI extracts all the details instantly.
                </p>
              </div>
              <ArrowRight className={`absolute right-4 top-5 size-4 transition-transform ${
                importMode === "linkedin" ? "rotate-90 text-[#0A66C2]" : "text-muted-foreground/50 group-hover:translate-x-0.5"
              }`} />
            </button>

            {/* PDF / Document Option */}
            <button
              type="button"
              onClick={() => {
                if (importMode === "document") {
                  setImportMode(null);
                } else {
                  setImportMode("document");
                }
              }}
              className={`group relative flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all ${
                importMode === "document"
                  ? "border-foreground/20 bg-foreground/[0.02]"
                  : "border-border hover:border-foreground/20 hover:bg-muted/30"
              }`}
            >
              <div className={`flex size-11 items-center justify-center rounded-lg ${
                importMode === "document" ? "bg-foreground/5" : "bg-muted"
              }`}>
                <FileText className={`size-5 ${importMode === "document" ? "text-foreground" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold">Upload a Job Description</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Upload a PDF, DOCX, or TXT file and let AI parse the role, tech stack, experience level, and more in seconds.
                </p>
              </div>
              <ArrowRight className={`absolute right-4 top-5 size-4 transition-transform ${
                importMode === "document" ? "rotate-90 text-foreground" : "text-muted-foreground/50 group-hover:translate-x-0.5"
              }`} />
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

      {/* ── Manual Form ────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Requirement Details</CardTitle>
          <CardDescription>
            Fill out the details below. Our team will start matching engineers
            once submitted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Role Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior React Engineer"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <TechStackSelector
                value={techStack}
                onChange={(val) =>
                  setValue("techStack", val, { shouldValidate: true })
                }
                max={20}
              />
              {errors.techStack && (
                <p className="text-xs text-red-600">
                  {errors.techStack.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experienceYearsMin">Min Years Experience</Label>
                <Input
                  id="experienceYearsMin"
                  type="number"
                  min={0}
                  max={50}
                  placeholder="e.g. 3"
                  className="font-mono"
                  {...register("experienceYearsMin", { valueAsNumber: true })}
                />
                {errors.experienceYearsMin && (
                  <p className="text-xs text-red-600">
                    {errors.experienceYearsMin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYearsMax">Max Years Experience</Label>
                <Input
                  id="experienceYearsMax"
                  type="number"
                  min={0}
                  max={50}
                  placeholder="e.g. 8"
                  className="font-mono"
                  {...register("experienceYearsMax", { valueAsNumber: true })}
                />
                {errors.experienceYearsMax && (
                  <p className="text-xs text-red-600">
                    {errors.experienceYearsMax.message}
                  </p>
                )}
              </div>
            </div>

            {derivedLevel && (
              <p className="text-xs text-muted-foreground">
                &rarr;{" "}
                {derivedLevel.charAt(0).toUpperCase() + derivedLevel.slice(1)}{" "}
                level
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="developersNeeded">Number of Developers</Label>
                <Select
                  value={String(developersNeeded)}
                  onValueChange={(val) =>
                    setValue("developersNeeded", Number(val), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="developersNeeded">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagementType">Engagement Type</Label>
                <Select
                  value={engagementType}
                  onValueChange={(val) =>
                    setValue(
                      "engagementType",
                      val as JobRequirementFormData["engagementType"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger id="engagementType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="project-based">Project-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezonePreference">Timezone Preference</Label>
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
                  <SelectTrigger id="timezonePreference">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
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
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Hiring Countries <span className="text-destructive">*</span>
              </Label>
              <CountrySelector
                value={hiringCountries}
                onChange={(codes) =>
                  setValue("hiringCountries", codes, { shouldValidate: true })
                }
              />
              {errors.hiringCountries && (
                <p className="text-sm text-destructive">
                  {errors.hiringCountries.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Budget Type</Label>
                <Select
                  value={budgetType}
                  onValueChange={(v) =>
                    setValue("budgetType", v as "hourly" | "monthly" | "annual", { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget Min ({budgetLabel}, optional)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="e.g. 60"
                  className="font-mono"
                  {...register("budgetMin")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget Max ({budgetLabel}, optional)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="e.g. 120"
                  className="font-mono"
                  {...register("budgetMax")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <MarkdownEditor
                value={description ?? ""}
                onChange={(val) =>
                  setValue("description", val, { shouldValidate: true })
                }
              />
              {errors.description && (
                <p className="text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                value={watch("startDate") ? new Date(watch("startDate") + "T00:00:00") : undefined}
                onChange={(d) => setValue("startDate", d ? d.toISOString().split("T")[0] : "", { shouldValidate: true })}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link href={isEdit && requirementId ? `/companies/dashboard/requirements/${requirementId}` : "/companies/dashboard/requirements"}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {isEdit ? "Save Changes" : "Submit Requirement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export { RequirementForm };
