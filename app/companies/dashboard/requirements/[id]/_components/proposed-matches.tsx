"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";

import {
  type JobRequirement,
  type ProposedMatch,
  type RequirementStatus,
  fetchCompanyRequirement,
  respondToMatch,
  fetchAvailableSlots,
  requestInterview,
  updateRequirementStatus,
  type AvailableSlotsResponse,
} from "@/lib/api/companies";
import { getTimezoneLabel } from "@/lib/constants/timezones";
import {
  formatDate,
  matchStatusBadgeClass,
  matchStatusLabel,
  priorityBadgeClass,
  priorityLabel,
  requirementStatusBadgeClass,
  requirementStatusLabel,
} from "@/app/admin/dashboard/_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { CountryFlags } from "@/lib/utils/country-flags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownDisplay } from "@/components/markdown-display";
import { experienceLabel } from "@/lib/utils/experience";
import { ActivityTimeline } from "./activity-timeline";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ProposedMatchesClient = ({
  requirementId,
}: {
  requirementId: string;
}) => {
  const { getToken } = useAuth();
  const [requirement, setRequirement] = useState<JobRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectDialog, setRejectDialog] = useState<ProposedMatch | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false);
  const [interviewDialog, setInterviewDialog] = useState<ProposedMatch | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotsResponse | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [interviewType, setInterviewType] = useState<"video" | "phone" | "in_person">("video");
  const [requestingInterview, setRequestingInterview] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await fetchCompanyRequirement(token, requirementId);
    setRequirement(data);
    setLoading(false);
  }, [getToken, requirementId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (match: ProposedMatch) => {
    setRespondingId(match.id);
    const token = await getToken();
    await respondToMatch(token, match.id, "accepted");
    const newStatus = match.status === "accepted" ? "active" : "accepted";
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.map((m) =>
          m.id === match.id
            ? { ...m, status: newStatus as ProposedMatch["status"], respondedAt: new Date().toISOString() }
            : m,
        ),
      };
    });
    setRespondingId(null);
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    setRespondingId(rejectDialog.id);
    const token = await getToken();
    await respondToMatch(
      token,
      rejectDialog.id,
      "rejected",
      rejectionReason || undefined,
    );
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.map((m) =>
          m.id === rejectDialog.id
            ? {
                ...m,
                status: "rejected" as const,
                rejectionReason: rejectionReason || undefined,
                respondedAt: new Date().toISOString(),
              }
            : m,
        ),
      };
    });
    setRejectDialog(null);
    setRejectionReason("");
    setRespondingId(null);
  };

  const openInterviewDialog = async (match: ProposedMatch) => {
    setInterviewDialog(match);
    setSelectedSlots(new Set());
    setLoadingSlots(true);
    const token = await getToken();
    const companyTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const result = await fetchAvailableSlots(token, match.id, { companyTimezone: companyTz });
    setAvailableSlots(result);
    setLoadingSlots(false);
  };

  const handleRequestInterview = async () => {
    if (!interviewDialog || selectedSlots.size === 0) return;
    setRequestingInterview(true);
    const token = await getToken();
    const slots = Array.from(selectedSlots).map((start) => {
      const end = new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString();
      return { start, end };
    });
    await requestInterview(token, interviewDialog.id, {
      proposedSlots: slots,
      type: interviewType,
      companyTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.map((m) =>
          m.id === interviewDialog.id
            ? { ...m, status: "interview_requested" as const }
            : m,
        ),
      };
    });
    setInterviewDialog(null);
    setSelectedSlots(new Set());
    setRequestingInterview(false);
  };

  const handleStatusChange = async (newStatus: RequirementStatus) => {
    if (!requirement || newStatus === requirement.status) return;
    setUpdatingStatus(true);
    try {
      const token = await getToken();
      const updated = await updateRequirementStatus(token, requirementId, newStatus);
      setRequirement(updated);
    } catch {
      // silently fail — status stays as-is
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!requirement) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Requirement not found.
        </CardContent>
      </Card>
    );
  }

  const matches = requirement.proposedMatches ?? [];
  const activeMatches = matches.filter(
    (m) => m.status !== "rejected" && m.status !== "declined" && m.status !== "ended",
  );

  return (
    <>
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link href="/companies/dashboard/requirements">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold">{requirement.title}</h1>
            <Badge
              variant="outline"
              className={priorityBadgeClass(requirement.priority)}
            >
              {priorityLabel[requirement.priority]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Posted {formatDate(requirement.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={requirement.status}
            onValueChange={(val) => handleStatusChange(val as RequirementStatus)}
            disabled={updatingStatus}
          >
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["open", "matching", "partially_filled", "filled", "closed"] as RequirementStatus[]).map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {requirementStatusLabel[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/companies/dashboard/requirements/${requirementId}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* ─── Left column: Requirement details ─── */}
        <div className="space-y-6">
          {/* Matched candidates banner */}
          <div className="flex items-center gap-3 rounded-lg border border-pulse/25 bg-pulse/5 p-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
              <Users className="size-4 text-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {matches.length === 0
                  ? "No candidates matched yet"
                  : `${matches.length} matched candidate${matches.length !== 1 ? "s" : ""}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {matches.length === 0
                  ? "Our team is reviewing and matching engineers to this requirement."
                  : `${activeMatches.length} active · ${matches.length - activeMatches.length} closed`}
              </p>
            </div>
          </div>

          {/* Requirement details */}
          <section>
            <h2 className="text-base font-semibold">Requirement Details</h2>
            <Separator className="my-3" />

            <div className="flex flex-wrap items-center gap-1.5">
              {requirement.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {requirement.hiringCountries?.length > 0 && (
                <CountryFlags codes={requirement.hiringCountries} />
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Experience
                </p>
                <p>{experienceLabel(requirement.experienceYearsMin, requirement.experienceYearsMax, requirement.experienceLevel)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Engagement
                </p>
                <p className="capitalize">
                  {requirement.engagementType?.replace("-", " ") ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Timezone
                </p>
                <p>
                  {getTimezoneLabel(requirement.timezonePreference)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Budget
                </p>
                <p className="font-mono">
                  {requirement.budgetMin && requirement.budgetMax
                    ? `$${requirement.budgetMin}–$${requirement.budgetMax}${requirement.budgetType === "annual" ? "/yr" : requirement.budgetType === "monthly" ? "/mo" : "/hr"}`
                    : "Flexible"}
                </p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <div className="text-sm text-muted-foreground">
              <div className={descriptionExpanded ? undefined : "line-clamp-4"}>
                <MarkdownDisplay content={requirement.description} />
              </div>
              <button
                type="button"
                onClick={() => setDescriptionExpanded((prev) => !prev)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-pulse hover:underline"
              >
                {descriptionExpanded ? (
                  <>
                    Show less <ChevronUp className="size-3" />
                  </>
                ) : (
                  <>
                    Show full description <ChevronDown className="size-3" />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Activity Timeline */}
          <section>
            <h2 className="text-base font-semibold">Activity Timeline</h2>
            <Separator className="my-3" />
            <ActivityTimeline requirement={requirement} />
          </section>
        </div>

        {/* ─── Right column: Matched Candidates panel ─── */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Matched Candidates
          </p>

          {matches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Users className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No candidates matched yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            matches.map((match) => (
              <CandidateCard
                key={match.id}
                match={match}
                respondingId={respondingId}
                onAccept={handleAccept}
                onReject={setRejectDialog}
                onInterview={openInterviewDialog}
              />
            ))
          )}
        </div>
      </div>

      {/* Reject dialog */}
      <Dialog
        open={rejectDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectDialog(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Match</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting{" "}
              {rejectDialog?.developer.name}.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={respondingId === rejectDialog?.id}
              onClick={handleReject}
            >
              {respondingId === rejectDialog?.id && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview dialog */}
      <Dialog
        open={interviewDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setInterviewDialog(null);
            setSelectedSlots(new Set());
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Interview</DialogTitle>
            <DialogDescription>
              Select time slots to propose to {interviewDialog?.developer.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Interview Type
              </p>
              <div className="flex gap-2">
                {(["video", "phone", "in_person"] as const).map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={interviewType === t ? "default" : "outline"}
                    onClick={() => setInterviewType(t)}
                    className="text-xs capitalize"
                  >
                    {t.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Available Slots
              </p>
              {loadingSlots && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loadingSlots && availableSlots?.availabilityNotSet && (
                <p className="text-sm text-muted-foreground">
                  This developer hasn&apos;t set their availability yet. You can still propose times manually.
                </p>
              )}
              {!loadingSlots && availableSlots && !availableSlots.availabilityNotSet && (
                <div className="max-h-60 space-y-1 overflow-y-auto">
                  {availableSlots.slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No available slots found.</p>
                  ) : (
                    availableSlots.slots.slice(0, 30).map((slot) => (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => {
                          setSelectedSlots((prev) => {
                            const next = new Set(prev);
                            if (next.has(slot.start)) next.delete(slot.start);
                            else next.add(slot.start);
                            return next;
                          });
                        }}
                        className={`w-full rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                          selectedSlots.has(slot.start)
                            ? "border-pulse/40 bg-pulse/10 text-foreground"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <span className="font-mono">
                          {new Date(slot.start).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          {" "}
                          {new Date(slot.start).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
              {selectedSlots.size > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {selectedSlots.size} slot{selectedSlots.size !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setInterviewDialog(null);
                setSelectedSlots(new Set());
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={selectedSlots.size === 0 || requestingInterview}
              onClick={handleRequestInterview}
            >
              {requestingInterview && <Loader2 className="mr-2 size-4 animate-spin" />}
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* ─── Candidate Card ────────────────────────────────────────────── */

function CandidateCard({
  match,
  respondingId,
  onAccept,
  onReject,
  onInterview,
}: {
  match: ProposedMatch;
  respondingId: string | null;
  onAccept: (match: ProposedMatch) => void;
  onReject: (match: ProposedMatch) => void;
  onInterview: (match: ProposedMatch) => void;
}) {
  const dev = match.developer;

  return (
    <Card className={match.status === "accepted" ? "border-pulse/30" : ""}>
      <CardContent className="p-4 space-y-3">
        {/* Developer info */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Avatar className="size-10">
              <AvatarImage src={dev.avatar} alt={dev.name} />
              <AvatarFallback className="text-xs">
                {getInitials(dev.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{dev.name}</p>
              <Badge
                variant="outline"
                className={`shrink-0 text-[10px] ${matchStatusBadgeClass(match.status)}`}
              >
                {matchStatusLabel[match.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{dev.role}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {dev.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {dev.location}
            </span>
          )}
          <span>{dev.yearsOfExperience} yrs exp</span>
          {dev.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {dev.rating}
            </span>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {dev.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
              {skill}
            </Badge>
          ))}
          {dev.skills.length > 4 && (
            <span className="text-[10px] text-muted-foreground">
              +{dev.skills.length - 4}
            </span>
          )}
        </div>

        {/* Rate */}
        <div className="font-mono text-sm">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: match.currency || "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(match.proposedHourlyRate)}/hr
          <span className="text-muted-foreground"> | </span>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: match.currency || "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(match.proposedMonthlyRate)}/mo
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {match.status === "accepted" && (
            <>
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={respondingId === match.id}
                onClick={() => onAccept(match)}
              >
                {respondingId === match.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Confirm Hire
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => onInterview(match)}
              >
                <Video className="size-3.5" />
                Interview
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={respondingId === match.id}
                onClick={() => onReject(match)}
              >
                <X className="size-3.5" />
                Decline
              </Button>
            </>
          )}

          {match.status === "interview_requested" && (
            <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-600/20">
              <Clock className="mr-1 size-3" />
              Awaiting Developer Response
            </Badge>
          )}

          {match.status === "interview_scheduled" && (
            <>
              <Badge variant="outline" className="bg-sky-500/10 text-sky-600 border-sky-600/20">
                <Calendar className="mr-1 size-3" />
                Interview Scheduled
              </Badge>
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={respondingId === match.id}
                onClick={() => onAccept(match)}
              >
                {respondingId === match.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Confirm Hire
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={respondingId === match.id}
                onClick={() => onReject(match)}
              >
                <X className="size-3.5" />
                Decline
              </Button>
            </>
          )}

          {match.status === "rejected" && match.rejectionReason && (
            <p className="text-xs text-muted-foreground">
              Reason: {match.rejectionReason}
            </p>
          )}

          <Link
            href={`/companies/dashboard/developers/${match.developerId}`}
            className="ml-auto inline-flex items-center gap-1 text-xs text-pulse hover:underline"
          >
            View Profile
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProposedMatchesClient };
