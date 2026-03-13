"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  FileText,
  Loader2,
  Upload,
  UserCheck,
  X,
} from "lucide-react";

import type {
  AdminInterview,
  AdminTeamMember,
  InterviewScoring,
  ScoringCategory,
} from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type InterviewStatus,
  interviewStatusLabel,
  interviewStatusBadgeClass,
  getInitials,
} from "../../_components/dashboard-data";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const TABS = [
  { value: "all", label: "All" },
  { value: "pipeline", label: "Pipeline" },
  { value: "company_request", label: "Company" },
] as const;

const DEFAULT_SCORING: InterviewScoring = {
  categories: [
    { name: "Technical Knowledge", score: 0, maxScore: 10, notes: "" },
    { name: "Problem Solving", score: 0, maxScore: 10, notes: "" },
    { name: "Communication", score: 0, maxScore: 10, notes: "" },
    { name: "Culture Fit", score: 0, maxScore: 10, notes: "" },
    { name: "Experience Relevance", score: 0, maxScore: 10, notes: "" },
  ],
  overallScore: 0,
  overallNotes: "",
};

interface InterviewsClientProps {
  interviews: AdminInterview[];
  team: AdminTeamMember[];
  token: string;
}

function InterviewsClient({ interviews, team, token }: InterviewsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTab = searchParams.get("tab") ?? "all";
  const currentStatus = searchParams.get("status") ?? "all";

  // Detail dialog state
  const [selected, setSelected] = useState<AdminInterview | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formHostId, setFormHostId] = useState("");
  const [formHostName, setFormHostName] = useState("");
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formMeetingLink, setFormMeetingLink] = useState("");
  const [formType, setFormType] = useState("video");
  const [formNotes, setFormNotes] = useState("");
  const [formOutcome, setFormOutcome] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formScoring, setFormScoring] = useState<InterviewScoring>(DEFAULT_SCORING);

  // Transcript upload state
  const [uploading, setUploading] = useState(false);
  const [transcriptName, setTranscriptName] = useState<string | null>(null);
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);

  // Scoring tab
  const [activeTab, setActiveTab] = useState<"details" | "scoring" | "transcript">("details");

  const filteredInterviews = useMemo(() => {
    let result = interviews;

    if (currentTab !== "all") {
      result = result.filter((i) => i.source === currentTab);
    }

    if (currentStatus && currentStatus !== "all") {
      result = result.filter((i) => i.status === currentStatus);
    }

    return result;
  }, [interviews, currentTab, currentStatus]);

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const openDetail = (interview: AdminInterview) => {
    setSelected(interview);
    setActiveTab("details");

    // Pre-fill form
    setFormHostId(interview.adminHostId ?? "");
    setFormHostName(interview.adminHostName ?? "");
    setFormScheduledAt(
      interview.scheduledAt
        ? new Date(interview.scheduledAt).toISOString().slice(0, 16)
        : "",
    );
    setFormMeetingLink(interview.meetingLink ?? "");
    setFormType(interview.type);
    setFormNotes(interview.adminNotes ?? "");
    setFormOutcome(interview.outcome ?? "");
    setFormStatus(interview.status);
    setFormScoring(
      interview.scoring
        ? { ...DEFAULT_SCORING, ...interview.scoring }
        : { ...DEFAULT_SCORING },
    );
    setTranscriptName(interview.transcriptOriginalName ?? null);
    setTranscriptUrl(interview.transcriptUrl ?? null);
  };

  const handleHostChange = (clerkUserId: string) => {
    setFormHostId(clerkUserId);
    const member = team.find((t) => t.clerkUserId === clerkUserId);
    if (member) {
      setFormHostName(
        [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email || "",
      );
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);

    try {
      await fetch(`${apiBaseUrl}/api/admin/interviews/${selected.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminHostId: formHostId || undefined,
          adminHostName: formHostName || undefined,
          scheduledAt: formScheduledAt || undefined,
          meetingLink: formMeetingLink || undefined,
          type: formType,
          adminNotes: formNotes,
          outcome: formOutcome || undefined,
          status: formStatus !== selected.status ? formStatus : undefined,
          scoring: formScoring,
        }),
      });

      setSelected(null);
      startTransition(() => {
        router.refresh();
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTranscriptUpload = async (file: File) => {
    if (!selected) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("transcript", file);

      const res = await fetch(
        `${apiBaseUrl}/api/admin/interviews/${selected.id}/transcript`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (res.ok) {
        const data = await res.json();
        setTranscriptName(file.name);
        setTranscriptUrl(data.transcriptUrl);
      }
    } finally {
      setUploading(false);
    }
  };

  const updateScoringCategory = (
    index: number,
    field: keyof ScoringCategory,
    value: string | number,
  ) => {
    setFormScoring((prev) => {
      const categories = [...prev.categories];
      categories[index] = { ...categories[index], [field]: value };
      const overallScore = Math.round(
        categories.reduce((sum, c) => sum + (c.score / c.maxScore) * 100, 0) /
          categories.length,
      );
      return { ...prev, categories, overallScore };
    });
  };

  const pipelineCount = interviews.filter((i) => i.source === "pipeline").length;
  const pendingCount = interviews.filter(
    (i) => i.status === "requested" && i.source === "pipeline",
  ).length;

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Interviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage pipeline and company interviews. Assign interviewers, upload transcripts, and score candidates.
        </p>
      </div>

      <div className="flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => switchTab(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.value === "pipeline" && pipelineCount > 0 && (
              <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                {pipelineCount}
              </span>
            )}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                currentTab === tab.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={currentStatus}
          onValueChange={(v) => pushParams({ status: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="rescheduled">Rescheduled</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-3 text-xs text-muted-foreground">
          <span>{filteredInterviews.length} total</span>
          {pendingCount > 0 && (
            <span className="text-amber-600">{pendingCount} pending setup</span>
          )}
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <div className="rounded-md border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No interviews found.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Interviewer</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterviews.map((interview) => (
                <TableRow
                  key={interview.id}
                  className="cursor-pointer"
                  onClick={() => openDetail(interview)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 shrink-0">
                        <AvatarImage
                          src={interview.developerAvatar || undefined}
                          alt={interview.developerName}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(interview.developerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {interview.developerName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {interview.developerEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {interview.developerRole || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {interview.adminHostName ? (
                      <div className="flex items-center gap-1 text-sm">
                        <UserCheck className="size-3 text-emerald-600" />
                        {interview.adminHostName}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {interview.scheduledAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="font-mono text-xs">
                          {new Date(interview.scheduledAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}{" "}
                          {new Date(interview.scheduledAt).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {interview.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={interviewStatusBadgeClass(interview.status as InterviewStatus)}
                    >
                      {interviewStatusLabel[interview.status as InterviewStatus] ?? interview.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {interview.outcome ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          interview.outcome === "passed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-600/20"
                            : interview.outcome === "failed"
                              ? "bg-red-500/10 text-red-600 border-red-600/20"
                              : "bg-zinc-500/10 text-zinc-600 border-zinc-600/20",
                        )}
                      >
                        {interview.outcome.charAt(0).toUpperCase() + interview.outcome.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {interview.source === "pipeline" ? "Pipeline" : "Company"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Interview Detail Dialog */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              {selected && (
                <>
                  {selected.developerName}
                  {selected.companyName && <> &mdash; {selected.companyName}</>}
                  {selected.requirementTitle && (
                    <> &middot; {selected.requirementTitle}</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Inner tabs */}
          <div className="flex gap-0 border-b border-border -mx-6 px-6">
            {(["details", "scoring", "transcript"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors capitalize",
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                    activeTab === tab ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Interviewer
                  </Label>
                  <Select value={formHostId} onValueChange={handleHostChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map((member) => (
                        <SelectItem
                          key={member.clerkUserId}
                          value={member.clerkUserId}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="size-5">
                              <AvatarImage src={member.profilePhotoUrl ?? undefined} />
                              <AvatarFallback className="text-[8px]">
                                {getInitials(
                                  [member.firstName, member.lastName]
                                    .filter(Boolean)
                                    .join(" ") || "?",
                                )}
                              </AvatarFallback>
                            </Avatar>
                            {[member.firstName, member.lastName]
                              .filter(Boolean)
                              .join(" ") || member.email}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Interview Type
                  </Label>
                  <Select value={formType} onValueChange={setFormType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Date & Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={formScheduledAt}
                    onChange={(e) => setFormScheduledAt(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </Label>
                  <Select value={formStatus} onValueChange={setFormStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Meeting Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    value={formMeetingLink}
                    onChange={(e) => setFormMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                  {formMeetingLink && (
                    <Button size="icon" variant="outline" asChild>
                      <a href={formMeetingLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Outcome
                  </Label>
                  <Select value={formOutcome} onValueChange={setFormOutcome}>
                    <SelectTrigger>
                      <SelectValue placeholder="Not yet decided" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="undecided">Undecided</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Internal Notes
                </Label>
                <Textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Interview prep notes, context, observations..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === "scoring" && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Scoring Framework
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold font-mono">
                    {formScoring.overallScore}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>

              <div className="space-y-3">
                {formScoring.categories.map((cat, i) => (
                  <div key={cat.name} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          max={cat.maxScore}
                          value={cat.score}
                          onChange={(e) =>
                            updateScoringCategory(i, "score", Math.min(cat.maxScore, Math.max(0, parseInt(e.target.value) || 0)))
                          }
                          className="w-16 h-8 text-center font-mono text-sm"
                        />
                        <span className="text-xs text-muted-foreground">/ {cat.maxScore}</span>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          cat.score / cat.maxScore >= 0.7
                            ? "bg-emerald-500"
                            : cat.score / cat.maxScore >= 0.4
                              ? "bg-amber-500"
                              : "bg-red-500",
                        )}
                        style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                      />
                    </div>
                    <Textarea
                      value={cat.notes}
                      onChange={(e) => updateScoringCategory(i, "notes", e.target.value)}
                      placeholder={`Notes on ${cat.name.toLowerCase()}...`}
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Overall Notes
                </Label>
                <Textarea
                  value={formScoring.overallNotes}
                  onChange={(e) =>
                    setFormScoring((prev) => ({
                      ...prev,
                      overallNotes: e.target.value,
                    }))
                  }
                  placeholder="Overall assessment summary..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === "transcript" && (
            <div className="space-y-4 pt-2">
              {transcriptName ? (
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <FileText className="size-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{transcriptName}</p>
                    <p className="text-xs text-muted-foreground">Uploaded</p>
                  </div>
                  {transcriptUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={transcriptUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 size-3" />
                        View
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setTranscriptName(null);
                      setTranscriptUrl(null);
                    }}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-8 transition-colors hover:bg-muted/50">
                  {uploading ? (
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="size-6 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload transcript"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, TXT, DOC, or DOCX up to 20MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.doc,.docx,.md"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleTranscriptUpload(file);
                    }}
                  />
                </label>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { InterviewsClient };
