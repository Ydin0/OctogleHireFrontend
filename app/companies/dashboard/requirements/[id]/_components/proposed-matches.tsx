"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Loader2,
  MapPin,
  Star,
  X,
} from "lucide-react";

import {
  type JobRequirement,
  type ProposedMatch,
  fetchCompanyRequirement,
  respondToMatch,
} from "@/lib/api/companies";
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
import { MarkdownDisplay } from "@/components/markdown-display";
import { experienceLabel } from "@/lib/utils/experience";

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
    // Optimistic update
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.map((m) =>
          m.id === match.id
            ? { ...m, status: "accepted" as const, respondedAt: new Date().toISOString() }
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

  return (
    <>
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
              className={requirementStatusBadgeClass(requirement.status)}
            >
              {requirementStatusLabel[requirement.status]}
            </Badge>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requirement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {requirement.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
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
                {requirement.engagementType.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Timezone
              </p>
              <p className="capitalize">
                {requirement.timezonePreference.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Budget
              </p>
              <p className="font-mono">
                {requirement.budgetMin && requirement.budgetMax
                  ? `$${requirement.budgetMin}–$${requirement.budgetMax}/hr`
                  : "Flexible"}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <MarkdownDisplay content={requirement.description} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proposed Matches</CardTitle>
          <CardDescription>
            {matches.length === 0
              ? "No matches proposed yet. Our team is reviewing candidates."
              : `${matches.length} engineer${matches.length !== 1 ? "s" : ""} proposed for this role.`}
          </CardDescription>
        </CardHeader>
        {matches.length > 0 && (
          <CardContent className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="rounded-lg border border-border/70 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={match.developer.avatar}
                        alt={match.developer.name}
                      />
                      <AvatarFallback>
                        {getInitials(match.developer.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">
                          {match.developer.name}
                        </p>
                        <Badge
                          variant="outline"
                          className={matchStatusBadgeClass(match.status)}
                        >
                          {matchStatusLabel[match.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {match.developer.role}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {match.developer.location}
                        </span>
                        <span>{match.developer.yearsOfExperience} yrs exp</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {match.developer.rating}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.developer.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {match.developer.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{match.developer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-mono text-sm font-semibold">
                      ${match.proposedHourlyRate}/hr{" "}
                      <span className="text-muted-foreground">|</span>{" "}
                      ${match.proposedMonthlyRate.toLocaleString()}/mo
                    </p>

                    {match.status === "proposed" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          disabled={respondingId === match.id}
                          onClick={() => handleAccept(match)}
                        >
                          {respondingId === match.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Check className="size-3.5" />
                          )}
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={respondingId === match.id}
                          onClick={() => setRejectDialog(match)}
                        >
                          <X className="size-3.5" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {match.status === "rejected" && match.rejectionReason && (
                      <p className="max-w-[240px] text-right text-xs text-muted-foreground">
                        Reason: {match.rejectionReason}
                      </p>
                    )}

                    <Link
                      href={`/developers/${match.developerId}`}
                      className="inline-flex items-center gap-1 text-xs text-pulse hover:underline"
                    >
                      View Profile
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

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
    </>
  );
};

export { ProposedMatchesClient };
