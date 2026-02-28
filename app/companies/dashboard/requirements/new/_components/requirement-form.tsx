"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  FileUp,
  Linkedin,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import type { UseFormSetValue } from "react-hook-form";
import {
  jobRequirementSchema,
  type JobRequirementFormData,
} from "@/lib/schemas/job-requirement";
import {
  createJobRequirement,
  fetchLinkedInJobs,
  parseLinkedInJob,
  parseJobDocument,
  type LinkedInJob,
  type ParsedJobData,
} from "@/lib/api/companies";
import { yearsToLevel } from "@/lib/utils/experience";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function prefillForm(
  parsed: ParsedJobData,
  setValue: UseFormSetValue<JobRequirementFormData>,
) {
  if (parsed.title) setValue("title", parsed.title, { shouldValidate: true });
  if (parsed.techStack?.length)
    setValue("techStack", parsed.techStack, { shouldValidate: true });
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

const RequirementForm = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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
      experienceYearsMin: 3,
      experienceYearsMax: 5,
      developersNeeded: 1,
      engagementType: "full-time",
      timezonePreference: "any",
      priority: "medium",
    },
  });

  const techStack = watch("techStack");
  const description = watch("description");
  const yearsMin = watch("experienceYearsMin");
  const yearsMax = watch("experienceYearsMax");

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
      // Error is handled by loading state reset
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
      });
      prefillForm(parsed, setValue);
      setLinkedinJobs([]);
    } catch {
      // Error is handled by loading state reset
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
    } catch {
      // Error is handled by loading state reset
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
      await createJobRequirement(token, {
        ...data,
        experienceLevel: derivedExperienceLevel,
        experienceYearsMin: data.experienceYearsMin,
        experienceYearsMax: data.experienceYearsMax,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : undefined,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : undefined,
      });
      router.push("/companies/dashboard/requirements");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href="/companies/dashboard/requirements">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Post New Requirement</h1>
          <p className="text-sm text-muted-foreground">
            Describe the role and we&apos;ll match you with engineers.
          </p>
        </div>
      </div>

      {/* ── Import Methods ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4" />
            Import Job Description
          </CardTitle>
          <CardDescription>
            Import from LinkedIn or upload a document to auto-fill the form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* LinkedIn import */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5">
              <Linkedin className="size-3.5" />
              LinkedIn Company Jobs
            </Label>
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
                disabled={
                  fetchingJobs || !linkedinUrl.includes("linkedin.com/company/")
                }
                onClick={handleFetchJobs}
                className="gap-1.5"
              >
                {fetchingJobs && <Loader2 className="size-3.5 animate-spin" />}
                Fetch Jobs
              </Button>
            </div>

            {fetchingJobs && (
              <p className="text-xs text-muted-foreground">
                Fetching jobs from LinkedIn... This may take 30-60 seconds.
              </p>
            )}

            {linkedinJobs.length > 0 && (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-2">
                {linkedinJobs.map((job) => (
                  <button
                    key={job.externalId || job.title}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-border/50 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                    disabled={parsingJob === job.externalId}
                    onClick={() => handleSelectJob(job)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {[job.location, job.employmentType]
                          .filter(Boolean)
                          .join(" \u00b7 ")}
                      </p>
                    </div>
                    {parsingJob === job.externalId && (
                      <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Document upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5">
              <FileUp className="size-3.5" />
              Upload Document
            </Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleDocUpload}
                disabled={parsingDoc}
                className="flex-1"
              />
            </div>
            {parsingDoc && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Parsing document with AI...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                  defaultValue="1"
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
                  defaultValue="full-time"
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
                  defaultValue="any"
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
                    <SelectItem value="any">Any Timezone</SelectItem>
                    <SelectItem value="americas">Americas</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia-pacific">Asia-Pacific</SelectItem>
                    <SelectItem value="overlap-us">
                      US Overlap (4+ hrs)
                    </SelectItem>
                    <SelectItem value="overlap-eu">
                      EU Overlap (4+ hrs)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  defaultValue="medium"
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget Min ($/hr, optional)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="e.g. 60"
                  className="font-mono"
                  {...register("budgetMin")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget Max ($/hr, optional)</Label>
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
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-xs text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" asChild>
                <Link href="/companies/dashboard/requirements">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Submit Requirement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export { RequirementForm };
