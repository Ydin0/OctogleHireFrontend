"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Link2,
  Loader2,
  Star,
  Video,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import type { CompanyInterview } from "@/lib/api/companies";
import {
  fetchCompanyInterview,
  updateCompanyInterview,
  completeInterview,
} from "@/lib/api/companies";
import {
  type InterviewStatus,
  interviewStatusLabel,
  interviewStatusBadgeClass,
  formatDate,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
}

const interviewTypeBadge = (type: string) => {
  switch (type) {
    case "technical":
      return "bg-violet-500/10 text-violet-600 border-violet-600/20";
    case "cultural":
      return "bg-sky-500/10 text-sky-600 border-sky-600/20";
    case "screening":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const outcomeBadge = (outcome: string) => {
  switch (outcome) {
    case "passed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "failed":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "undecided":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-colors hover:text-amber-500"
        >
          <Star
            className={`size-5 ${
              star <= value
                ? "fill-amber-500 text-amber-500"
                : "text-zinc-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function InterviewDetailPage() {
  const { getToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<CompanyInterview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Meeting link state
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLinkSaved, setMeetingLinkSaved] = useState(false);

  // Notes state
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Complete dialog state
  const [completeOpen, setCompleteOpen] = useState(false);
  const [outcome, setOutcome] = useState<"passed" | "failed" | "undecided">(
    "undecided",
  );
  const [completeNotes, setCompleteNotes] = useState("");
  const [completeRating, setCompleteRating] = useState(0);
  const [completing, setCompleting] = useState(false);

  // Accept alternative slot state
  const [acceptingSlot, setAcceptingSlot] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    const token = await getToken();
    const data = await fetchCompanyInterview(token, interviewId);
    if (data) {
      setInterview(data);
      setMeetingLink(data.meetingLink ?? "");
      setNotes(data.companyNotes ?? "");
    }
    setLoading(false);
  }, [getToken, interviewId]);

  useEffect(() => {
    loadInterview();
  }, [loadInterview]);

  async function handleSaveMeetingLink() {
    setSaving(true);
    try {
      const token = await getToken();
      const updated = await updateCompanyInterview(token, interviewId, {
        meetingLink,
      });
      if (updated) {
        setInterview(updated);
        setMeetingLinkSaved(true);
        setTimeout(() => setMeetingLinkSaved(false), 2000);
        toast.success("Meeting link saved");
      }
    } catch {
      toast.error("Failed to save meeting link");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotes() {
    setSaving(true);
    try {
      const token = await getToken();
      const updated = await updateCompanyInterview(token, interviewId, {
        companyNotes: notes,
      });
      if (updated) {
        setInterview(updated);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
        toast.success("Notes saved");
      }
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  }

  async function handleAcceptSlot(slotStart: string) {
    setAcceptingSlot(slotStart);
    try {
      const token = await getToken();
      const updated = await updateCompanyInterview(token, interviewId, {
        acceptAlternativeSlot: slotStart,
      });
      if (updated) {
        setInterview(updated);
        toast.success("Time slot accepted");
      }
    } catch {
      toast.error("Failed to accept time slot");
    } finally {
      setAcceptingSlot(null);
    }
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      const token = await getToken();
      const updated = await completeInterview(token, interviewId, {
        outcome,
        companyNotes: completeNotes || undefined,
        companyRating: completeRating > 0 ? completeRating : undefined,
      });
      if (updated) setInterview(updated);
      toast.success("Interview marked as complete");
      setCompleteOpen(false);
    } catch {
      toast.error("Failed to complete interview");
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Video className="size-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold">Interview not found</h3>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => router.push("/companies/dashboard/interviews")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Interviews
        </Button>
      </div>
    );
  }

  const status = interview.status as InterviewStatus;
  const isRescheduled = status === "rescheduled";
  const isConfirmed = status === "confirmed";
  const isCompleted = status === "completed";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={() => router.push("/companies/dashboard/interviews")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Interviews
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage
                  src={interview.developerAvatar}
                  alt={interview.developerName}
                />
                <AvatarFallback>
                  {getInitials(interview.developerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">
                  {interview.developerName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {interview.developerRole}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {interview.requirementTitle}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] ${interviewTypeBadge(interview.type)}`}
              >
                {interview.type}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] ${interviewStatusBadgeClass(status)}`}
              >
                {interviewStatusLabel[status] ?? interview.status}
              </Badge>
              {interview.outcome && (
                <Badge
                  variant="outline"
                  className={`text-[10px] ${outcomeBadge(interview.outcome)}`}
                >
                  {interview.outcome}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Schedule & Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" />
              Interview Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Scheduled
                </p>
                {interview.scheduledAt ? (
                  <p className="mt-1 font-mono text-sm">
                    {formatDateTime(interview.scheduledAt)}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">Pending</p>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 font-mono text-sm">
                  {interview.durationMinutes} min
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Type
                </p>
                <p className="mt-1 text-sm capitalize">{interview.type}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Created
                </p>
                <p className="mt-1 font-mono text-sm">
                  {formatDate(interview.createdAt)}
                </p>
              </div>
            </div>

            {interview.meetingLink && (
              <>
                <Separator />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Meeting Link
                  </p>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-blue-600 hover:underline"
                  >
                    <Link2 className="size-3" />
                    {interview.meetingLink}
                  </a>
                </div>
              </>
            )}

            {interview.companyRating != null && interview.companyRating > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Rating
                  </p>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-4 ${
                          s <= interview.companyRating!
                            ? "fill-amber-500 text-amber-500"
                            : "text-zinc-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-6">
          {/* Rescheduled: alternative slots */}
          {isRescheduled &&
            interview.alternativeSlots &&
            interview.alternativeSlots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <RefreshCw className="size-4" />
                    Alternative Slots Proposed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The developer proposed the following alternative times.
                    Select one to confirm.
                  </p>
                  {interview.alternativeSlots.map((slot) => (
                    <div
                      key={slot.start}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-mono text-sm">
                          {formatDateTime(slot.start)}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          to {formatDateTime(slot.end)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full"
                        disabled={acceptingSlot !== null}
                        onClick={() => handleAcceptSlot(slot.start)}
                      >
                        {acceptingSlot === slot.start ? (
                          <Loader2 className="mr-2 size-3 animate-spin" />
                        ) : null}
                        Accept
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Mark Complete */}
          {isConfirmed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="size-4" />
                  Complete Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Once the interview is finished, record the outcome.
                </p>
                <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full">Mark Complete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Interview</DialogTitle>
                      <DialogDescription>
                        Record the outcome of the interview with{" "}
                        {interview.developerName}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-wider">
                          Outcome
                        </Label>
                        <div className="flex gap-2">
                          {(
                            ["passed", "failed", "undecided"] as const
                          ).map((o) => (
                            <Button
                              key={o}
                              type="button"
                              size="sm"
                              variant={outcome === o ? "default" : "outline"}
                              className="rounded-full capitalize"
                              onClick={() => setOutcome(o)}
                            >
                              {o}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-wider">
                          Rating
                        </Label>
                        <StarRating
                          value={completeRating}
                          onChange={setCompleteRating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-wider">
                          Notes
                        </Label>
                        <Textarea
                          placeholder="Interview feedback and observations..."
                          value={completeNotes}
                          onChange={(e) => setCompleteNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setCompleteOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-full"
                        disabled={completing}
                        onClick={handleComplete}
                      >
                        {completing && (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* Meeting Link — set by admin */}
          {!isCompleted && !interview.meetingLink && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="size-4" />
                  Meeting Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The OctogleHire team will set up the meeting and share the link with all parties once the interview is confirmed.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="size-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add your interview notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  className="rounded-full"
                  size="sm"
                  disabled={saving}
                  onClick={handleSaveNotes}
                >
                  {saving ? (
                    <Loader2 className="mr-2 size-3 animate-spin" />
                  ) : null}
                  {notesSaved ? "Saved" : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
