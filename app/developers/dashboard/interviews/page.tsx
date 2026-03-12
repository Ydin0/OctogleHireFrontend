"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Phone,
  Video,
  X,
} from "lucide-react";

import type { DeveloperInterview } from "@/lib/api/developer";
import {
  fetchDeveloperInterviews,
  respondToInterview,
} from "@/lib/api/developer";
import {
  interviewStatusBadgeClass,
  interviewStatusLabel,
  formatDate,
  type InterviewStatus,
} from "@/app/admin/dashboard/_components/dashboard-data";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function interviewTypeIcon(type: string) {
  switch (type) {
    case "video":
      return <Video className="size-3.5" />;
    case "phone":
      return <Phone className="size-3.5" />;
    case "in_person":
      return <MapPin className="size-3.5" />;
    default:
      return <Video className="size-3.5" />;
  }
}

function interviewTypeLabel(type: string) {
  switch (type) {
    case "video":
      return "Video Call";
    case "phone":
      return "Phone Call";
    case "in_person":
      return "In Person";
    default:
      return type;
  }
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSlotRange(start: string, end: string) {
  return `${formatDateTime(start)}, ${formatTime(start)} - ${formatTime(end)}`;
}

function getCountdownText(scheduledAt: string) {
  const now = new Date();
  const target = new Date(scheduledAt);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Now";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  if (diffDays > 0) {
    return `In ${diffDays}d ${remainingHours}h`;
  }
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  if (diffHours > 0) {
    return `In ${diffHours}h ${diffMinutes}m`;
  }
  return `In ${diffMinutes}m`;
}

function outcomeBadgeClass(outcome: string | null) {
  switch (outcome) {
    case "passed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "failed":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
}

function outcomeLabel(outcome: string | null) {
  switch (outcome) {
    case "passed":
      return "Passed";
    case "failed":
      return "Failed";
    default:
      return "Undecided";
  }
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const { getToken } = useAuth();

  const [interviews, setInterviews] = useState<DeveloperInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Per-interview UI state
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>(
    {},
  );
  const [declineDialogId, setDeclineDialogId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = await getToken();
      const data = await fetchDeveloperInterviews(token);
      if (!cancelled) {
        setInterviews(data ?? []);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  // ── Actions ──────────────────────────────────────────────────────────────

  async function handleConfirm(interviewId: string) {
    const slot = selectedSlots[interviewId];
    if (!slot) return;

    setActionLoading(interviewId);
    try {
      const token = await getToken();
      await respondToInterview(token, interviewId, {
        action: "confirm",
        selectedSlot: slot,
      });
      // Refetch
      const data = await fetchDeveloperInterviews(token);
      setInterviews(data ?? []);
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDecline(interviewId: string) {
    setActionLoading(interviewId);
    try {
      const token = await getToken();
      await respondToInterview(token, interviewId, {
        action: "decline",
        declineReason: declineReason || undefined,
      });
      setDeclineDialogId(null);
      setDeclineReason("");
      const data = await fetchDeveloperInterviews(token);
      setInterviews(data ?? []);
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
          <CardDescription>
            View and respond to interview requests from companies.
          </CardDescription>
        </CardHeader>
      </Card>

      {interviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No interview requests yet. When a company wants to interview you,
              it will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {interviews.map((interview) => {
          const isActionLoading = actionLoading === interview.id;
          const status = interview.status as InterviewStatus;

          return (
            <Card key={interview.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 shrink-0">
                      {interview.companyLogoUrl ? (
                        <AvatarImage
                          src={interview.companyLogoUrl}
                          alt={interview.companyName}
                        />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {getInitials(interview.companyName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-lg font-semibold">
                        {interview.companyName}
                      </CardTitle>
                      <CardDescription>
                        {interview.requirementTitle}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1 capitalize"
                    >
                      {interviewTypeIcon(interview.type)}
                      {interviewTypeLabel(interview.type)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={interviewStatusBadgeClass(status)}
                    >
                      {interviewStatusLabel[status] ?? interview.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Duration
                    </span>
                    <span className="font-mono text-sm">
                      {interview.durationMinutes} min
                    </span>
                  </div>

                  {interview.scheduledAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Scheduled
                      </span>
                      <span className="font-mono text-sm">
                        {formatDateTime(interview.scheduledAt)},{" "}
                        {formatTime(interview.scheduledAt)}
                      </span>
                    </div>
                  )}

                  {interview.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {interview.location}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Requested: show proposed time slots ──────────────── */}
                {status === "requested" &&
                  interview.proposedSlots &&
                  interview.proposedSlots.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Proposed Time Slots
                      </p>
                      <div className="space-y-2">
                        {interview.proposedSlots.map((slot, idx) => {
                          const slotKey = slot.start;
                          const isSelected =
                            selectedSlots[interview.id] === slotKey;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setSelectedSlots((prev) => ({
                                  ...prev,
                                  [interview.id]: slotKey,
                                }))
                              }
                              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                                isSelected
                                  ? "border-zinc-900 bg-zinc-900/5 dark:border-zinc-100 dark:bg-zinc-100/5"
                                  : "border-border hover:border-zinc-400 dark:hover:border-zinc-600"
                              }`}
                            >
                              <div
                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                  isSelected
                                    ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
                                    : "border-zinc-300 dark:border-zinc-600"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="size-3 text-white dark:text-zinc-900" />
                                )}
                              </div>
                              <span className="font-mono text-sm">
                                {formatSlotRange(slot.start, slot.end)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          size="sm"
                          className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                          disabled={
                            !selectedSlots[interview.id] || isActionLoading
                          }
                          onClick={() => handleConfirm(interview.id)}
                        >
                          {isActionLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Check className="size-3.5" />
                          )}
                          Confirm
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          disabled={isActionLoading}
                          onClick={() => setDeclineDialogId(interview.id)}
                        >
                          <X className="size-3.5" />
                          Decline
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          disabled
                        >
                          Propose Alternatives
                        </Button>
                      </div>
                    </div>
                  )}

                {/* ── Confirmed: countdown + meeting link ─────────────── */}
                {status === "confirmed" && (
                  <div className="space-y-3">
                    {interview.scheduledAt && (
                      <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                        <Calendar className="size-4 text-blue-600" />
                        <span className="font-mono text-sm font-medium">
                          {getCountdownText(interview.scheduledAt)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({formatDateTime(interview.scheduledAt)},{" "}
                          {formatTime(interview.scheduledAt)})
                        </span>
                      </div>
                    )}

                    {interview.meetingLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        asChild
                      >
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-3.5" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                {/* ── Completed: outcome badge ────────────────────────── */}
                {status === "completed" && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Outcome
                    </span>
                    <Badge
                      variant="outline"
                      className={outcomeBadgeClass(interview.outcome)}
                    >
                      {outcomeLabel(interview.outcome)}
                    </Badge>
                  </div>
                )}

                {/* ── Declined: reason ────────────────────────────────── */}
                {status === "declined" && interview.declineReason && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Decline Reason
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {interview.declineReason}
                    </p>
                  </div>
                )}

                {/* Meeting link for any non-completed status */}
                {status !== "confirmed" &&
                  status !== "completed" &&
                  interview.meetingLink && (
                    <div className="flex items-center gap-1.5">
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Meeting Link
                      </span>
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-blue-600 underline underline-offset-2 hover:text-blue-700"
                      >
                        {interview.meetingLink}
                      </a>
                    </div>
                  )}

                {/* Created date */}
                <div className="text-xs text-muted-foreground">
                  Requested {formatDate(interview.createdAt)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Decline Dialog ──────────────────────────────────────────────────── */}
      <Dialog
        open={declineDialogId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeclineDialogId(null);
            setDeclineReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Interview</DialogTitle>
            <DialogDescription>
              Provide a reason for declining this interview request. This helps
              the team understand your availability.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Reason for declining (optional)"
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setDeclineDialogId(null);
                setDeclineReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
              disabled={actionLoading !== null}
              onClick={() => {
                if (declineDialogId) handleDecline(declineDialogId);
              }}
            >
              {actionLoading !== null ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
