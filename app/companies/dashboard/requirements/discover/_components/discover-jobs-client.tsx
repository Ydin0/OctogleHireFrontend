"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Linkedin,
  Loader2,
  MapPin,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  type DiscoveredJob,
  type DiscoverJobsResponse,
  type ParsedJobData,
  discoverJobs,
  getDiscoveredJobs,
  importDiscoveredJobs,
  parseDiscoveredJobs,
  updateCompanyProfile,
  fetchCompanyProfile,
} from "@/lib/api/companies";
import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import { TIMEZONE_OPTIONS } from "@/lib/constants/timezones";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";
import { CountrySelector } from "@/components/country-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step = "configure" | "select" | "review";

interface ParsedResult {
  discoveredJobId: string;
  discoveredJob: DiscoveredJob;
  parsed: ParsedJobData;
}

const ALLOWED_TECH_SET = new Set(MARKETPLACE_TECH_STACK_OPTIONS);

const sourceBadge = (source: string) => {
  if (source === "linkedin")
    return (
      <Badge variant="outline" className="gap-1 text-[10px]">
        <Linkedin className="size-3" />
        LinkedIn
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-[10px]">
      <Search className="size-3" />
      Indeed
    </Badge>
  );
};

export function DiscoverJobsClient() {
  const router = useRouter();
  const { getToken } = useAuth();

  // State
  const [step, setStep] = useState<Step>("configure");
  const [loading, setLoading] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discovered jobs
  const [data, setData] = useState<DiscoverJobsResponse | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Parse + Review
  const [parsing, setParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState({ current: 0, total: 0 });
  const [parsedResults, setParsedResults] = useState<ParsedResult[]>([]);
  const [importing, setImporting] = useState(false);
  const [importCount, setImportCount] = useState<number | null>(null);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const [profile, discovered] = await Promise.all([
          fetchCompanyProfile(token),
          getDiscoveredJobs(token),
        ]);
        if (profile) {
          setCompanyName(profile.companyName);
        }
        if (discovered) {
          setData(discovered);
          setLinkedinUrl(discovered.linkedinCompanyUrl ?? "");
          if (discovered.jobs.length > 0) {
            setStep("select");
          }
        }
      } catch {
        // Silently fail — user can still configure
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getToken]);

  const handleSaveUrl = useCallback(async () => {
    setSavingUrl(true);
    setError(null);
    try {
      const token = await getToken();
      await updateCompanyProfile(token, { linkedinCompanyUrl: linkedinUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save URL");
    } finally {
      setSavingUrl(false);
    }
  }, [getToken, linkedinUrl]);

  const handleDiscover = useCallback(async () => {
    setDiscovering(true);
    setError(null);
    try {
      const token = await getToken();
      const result = await discoverJobs(token, {
        linkedinCompanyUrl: linkedinUrl || undefined,
        companyName: companyName || undefined,
      });
      setData(result);
      setSelected(new Set());
      if (result.jobs.length > 0) {
        setStep("select");
      } else {
        setError("No jobs found on LinkedIn or Indeed for this company.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Discovery failed");
    } finally {
      setDiscovering(false);
    }
  }, [getToken, linkedinUrl, companyName]);

  const handleToggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [],
  );

  const handleSelectAll = useCallback(
    (source: string) => {
      if (!data) return;
      const sourceJobs = data.jobs.filter(
        (j) => j.source === source && !j.importedAsRequirementId,
      );
      const allSelected = sourceJobs.every((j) => selected.has(j.id));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const j of sourceJobs) {
          if (allSelected) next.delete(j.id);
          else next.add(j.id);
        }
        return next;
      });
    },
    [data, selected],
  );

  const handleParseAndReview = useCallback(async () => {
    if (selected.size === 0) return;
    setParsing(true);
    setError(null);
    const ids = Array.from(selected);
    setParseProgress({ current: 0, total: ids.length });

    try {
      const token = await getToken();
      const results = await parseDiscoveredJobs(token, ids);
      const mapped: ParsedResult[] = results.map((r) => ({
        discoveredJobId: r.discoveredJobId,
        discoveredJob: data!.jobs.find((j) => j.id === r.discoveredJobId)!,
        parsed: r.parsed,
      }));
      setParseProgress({ current: ids.length, total: ids.length });
      setParsedResults(mapped);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to parse jobs");
    } finally {
      setParsing(false);
    }
  }, [getToken, selected, data]);

  const handleRemoveParsed = useCallback((discoveredJobId: string) => {
    setParsedResults((prev) =>
      prev.filter((r) => r.discoveredJobId !== discoveredJobId),
    );
  }, []);

  const handleUpdateParsed = useCallback(
    (discoveredJobId: string, field: string, value: unknown) => {
      setParsedResults((prev) =>
        prev.map((r) => {
          if (r.discoveredJobId !== discoveredJobId) return r;
          return {
            ...r,
            parsed: { ...r.parsed, [field]: value },
          };
        }),
      );
    },
    [],
  );

  const handleImport = useCallback(async () => {
    if (parsedResults.length === 0) return;
    setImporting(true);
    setError(null);
    try {
      const token = await getToken();
      const jobs = parsedResults.map((r) => ({
        discoveredJobId: r.discoveredJobId,
        title: r.parsed.title,
        techStack: r.parsed.techStack.filter((t) => ALLOWED_TECH_SET.has(t)),
        experienceYearsMin: r.parsed.experienceYearsMin,
        experienceYearsMax: r.parsed.experienceYearsMax,
        developersNeeded: r.parsed.developersNeeded,
        engagementType: r.parsed.engagementType,
        timezonePreference: r.parsed.timezonePreference,
        hiringCountries: r.parsed.hiringCountries ?? [],
        budgetMin: r.parsed.budgetMin,
        budgetMax: r.parsed.budgetMax,
        description: r.parsed.description,
        startDate: r.parsed.startDate,
        priority: r.parsed.priority,
      }));
      const created = await importDiscoveredJobs(token, jobs);
      setImportCount(created.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to import jobs");
    } finally {
      setImporting(false);
    }
  }, [getToken, parsedResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Success state
  if (importCount !== null) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-12 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
          <Check className="size-8 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold">
          {importCount} requirement{importCount !== 1 ? "s" : ""} imported
        </h2>
        <p className="text-sm text-muted-foreground">
          Your imported jobs are now live as open requirements.
        </p>
        <Button asChild>
          <Link href="/companies/dashboard/requirements">
            View Requirements
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <Link href="/companies/dashboard/requirements">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Discover Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Import your existing listings from LinkedIn and Indeed.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={
            step === "configure" ? "font-semibold text-foreground" : ""
          }
        >
          1. Configure
        </span>
        <ArrowRight className="size-3" />
        <span
          className={step === "select" ? "font-semibold text-foreground" : ""}
        >
          2. Select Jobs
        </span>
        <ArrowRight className="size-3" />
        <span
          className={step === "review" ? "font-semibold text-foreground" : ""}
        >
          3. Review & Import
        </span>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-2 p-4">
            <X className="size-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Configure Sources */}
      {step === "configure" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configure Sources</CardTitle>
            <CardDescription>
              Provide your LinkedIn company URL to discover job listings. Your
              company name will be used to search Indeed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="size-4" />
                LinkedIn Company URL
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://linkedin.com/company/your-company"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveUrl}
                  disabled={savingUrl || !linkedinUrl}
                  className="shrink-0"
                >
                  {savingUrl ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="size-4" />
                Company Name (for Indeed)
              </Label>
              <Input value={companyName} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                From your company profile.
              </p>
            </div>

            <Button
              onClick={handleDiscover}
              disabled={discovering || (!linkedinUrl && !companyName)}
              className="w-full gap-2"
            >
              {discovering ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Searching LinkedIn and Indeed...
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Discover Jobs
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review & Select */}
      {step === "select" && data && (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("configure")}
            >
              <ArrowLeft className="mr-1 size-3.5" />
              Back to Configure
            </Button>
            {data.lastDiscoveredAt && (
              <p className="text-xs text-muted-foreground">
                Last scanned:{" "}
                {new Date(data.lastDiscoveredAt).toLocaleDateString()}
                <Button
                  variant="link"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs"
                  onClick={handleDiscover}
                  disabled={discovering}
                >
                  {discovering ? "Refreshing..." : "Refresh"}
                </Button>
              </p>
            )}
          </div>

          {(["linkedin", "indeed"] as const).map((source) => {
            const jobs = data.jobs.filter((j) => j.source === source);
            if (jobs.length === 0) return null;
            const importable = jobs.filter(
              (j) => !j.importedAsRequirementId,
            );
            const allSelected =
              importable.length > 0 &&
              importable.every((j) => selected.has(j.id));

            return (
              <Collapsible key={source} defaultOpen>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        {source === "linkedin" ? (
                          <Linkedin className="size-4" />
                        ) : (
                          <Search className="size-4" />
                        )}
                        <CardTitle className="text-base capitalize">
                          {source} ({jobs.length})
                        </CardTitle>
                      </div>
                      <ChevronDown className="size-4 text-muted-foreground transition-transform [[data-state=open]_&]:rotate-180" />
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-3 pt-0">
                      {importable.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAll(source);
                          }}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                      )}
                      {jobs.map((job) => {
                        const imported = !!job.importedAsRequirementId;
                        return (
                          <div
                            key={job.id}
                            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                              imported
                                ? "border-border/50 bg-muted/30 opacity-60"
                                : selected.has(job.id)
                                  ? "border-foreground/20 bg-foreground/[0.02]"
                                  : "border-border/70 hover:border-foreground/15"
                            }`}
                          >
                            <Checkbox
                              checked={selected.has(job.id)}
                              onCheckedChange={() => handleToggle(job.id)}
                              disabled={imported}
                              className="mt-0.5"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-tight">
                                  {job.title}
                                </p>
                                <div className="flex shrink-0 items-center gap-1.5">
                                  {imported && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      Imported
                                    </Badge>
                                  )}
                                  {sourceBadge(job.source)}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                {job.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="size-3" />
                                    {job.location}
                                  </span>
                                )}
                                {job.employmentType && (
                                  <span className="capitalize">
                                    {job.employmentType}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="font-mono">
                                    {job.salary}
                                  </span>
                                )}
                                {job.postedAt && <span>{job.postedAt}</span>}
                              </div>
                              {job.url && (
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="size-3" />
                                  View original
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}

          {/* Bottom action bar */}
          {selected.size > 0 && (
            <div className="sticky bottom-4 z-10">
              <Card className="border-foreground/10 shadow-lg">
                <CardContent className="flex items-center justify-between p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selected.size}
                    </span>{" "}
                    job{selected.size !== 1 ? "s" : ""} selected
                  </p>
                  <Button
                    onClick={handleParseAndReview}
                    disabled={parsing}
                    className="gap-2"
                  >
                    {parsing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Parsing {parseProgress.current} of{" "}
                        {parseProgress.total}...
                      </>
                    ) : (
                      <>
                        Parse & Review ({selected.size})
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Step 3: Parse & Import */}
      {step === "review" && (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("select")}
            >
              <ArrowLeft className="mr-1 size-3.5" />
              Back to Selection
            </Button>
          </div>

          {parsing && (
            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-sm font-medium">
                  Parsing {parseProgress.current} of {parseProgress.total}{" "}
                  jobs...
                </p>
                <Progress
                  value={
                    parseProgress.total > 0
                      ? (parseProgress.current / parseProgress.total) * 100
                      : 0
                  }
                />
              </CardContent>
            </Card>
          )}

          {!parsing && parsedResults.length > 0 && (
            <div className="space-y-4">
              {parsedResults.map((result) => (
                <ParsedJobCard
                  key={result.discoveredJobId}
                  result={result}
                  onRemove={handleRemoveParsed}
                  onUpdate={handleUpdateParsed}
                />
              ))}

              <Card className="border-foreground/10">
                <CardContent className="flex items-center justify-between p-4">
                  <p className="text-sm text-muted-foreground">
                    {parsedResults.length} requirement
                    {parsedResults.length !== 1 ? "s" : ""} ready to import
                  </p>
                  <Button
                    onClick={handleImport}
                    disabled={importing || parsedResults.length === 0}
                    className="gap-2"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        Import {parsedResults.length} Requirement
                        {parsedResults.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Parsed Job Editable Card ─────────────────────────────────────────────────

function ParsedJobCard({
  result,
  onRemove,
  onUpdate,
}: {
  result: ParsedResult;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: unknown) => void;
}) {
  const { discoveredJobId, discoveredJob, parsed } = result;
  const [descOpen, setDescOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-2 min-w-0">
          {sourceBadge(discoveredJob.source)}
          <p className="truncate text-xs text-muted-foreground">
            {discoveredJob.location}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-destructive hover:text-destructive"
          onClick={() => onRemove(discoveredJobId)}
        >
          <Trash2 className="size-3.5" />
          Remove
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input
            value={parsed.title}
            onChange={(e) =>
              onUpdate(discoveredJobId, "title", e.target.value)
            }
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-1.5">
          <Label className="text-xs">Tech Stack</Label>
          <TechStackSelector
            value={parsed.techStack.filter((t) => ALLOWED_TECH_SET.has(t))}
            onChange={(v) => onUpdate(discoveredJobId, "techStack", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Experience Range */}
          <div className="space-y-1.5">
            <Label className="text-xs">Min Years</Label>
            <Input
              type="number"
              min={0}
              value={parsed.experienceYearsMin ?? 0}
              onChange={(e) =>
                onUpdate(
                  discoveredJobId,
                  "experienceYearsMin",
                  Number(e.target.value),
                )
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Years</Label>
            <Input
              type="number"
              min={0}
              value={parsed.experienceYearsMax ?? 5}
              onChange={(e) =>
                onUpdate(
                  discoveredJobId,
                  "experienceYearsMax",
                  Number(e.target.value),
                )
              }
            />
          </div>

          {/* Engagement Type */}
          <div className="space-y-1.5">
            <Label className="text-xs">Engagement</Label>
            <Select
              value={parsed.engagementType}
              onValueChange={(v) =>
                onUpdate(discoveredJobId, "engagementType", v)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="project-based">Project-based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <Label className="text-xs">Priority</Label>
            <Select
              value={parsed.priority}
              onValueChange={(v) =>
                onUpdate(discoveredJobId, "priority", v)
              }
            >
              <SelectTrigger>
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {/* Timezone */}
          <div className="space-y-1.5">
            <Label className="text-xs">Timezone</Label>
            <Select
              value={parsed.timezonePreference}
              onValueChange={(v) =>
                onUpdate(discoveredJobId, "timezonePreference", v)
              }
            >
              <SelectTrigger>
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

          {/* Budget */}
          <div className="space-y-1.5">
            <Label className="text-xs">Budget Min ($/hr)</Label>
            <Input
              type="number"
              min={0}
              className="font-mono"
              value={parsed.budgetMin ?? ""}
              onChange={(e) =>
                onUpdate(
                  discoveredJobId,
                  "budgetMin",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Budget Max ($/hr)</Label>
            <Input
              type="number"
              min={0}
              className="font-mono"
              value={parsed.budgetMax ?? ""}
              onChange={(e) =>
                onUpdate(
                  discoveredJobId,
                  "budgetMax",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        {/* Hiring Countries */}
        <div className="space-y-1.5">
          <Label className="text-xs">Hiring Countries</Label>
          <CountrySelector
            value={parsed.hiringCountries ?? []}
            onChange={(v) =>
              onUpdate(discoveredJobId, "hiringCountries", v)
            }
          />
        </div>

        {/* Description (collapsible) */}
        <Collapsible open={descOpen} onOpenChange={setDescOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ChevronDown
              className={`size-3.5 transition-transform ${descOpen ? "rotate-180" : ""}`}
            />
            Description
          </CollapsibleTrigger>
          <CollapsibleContent>
            <textarea
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={6}
              value={parsed.description}
              onChange={(e) =>
                onUpdate(discoveredJobId, "description", e.target.value)
              }
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
