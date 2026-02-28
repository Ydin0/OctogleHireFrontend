"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { use } from "react";

import {
  type JobRequirement,
  type ProposedMatch,
  fetchCompanyRequirementAdmin,
  proposeMatch,
  removeMatch,
} from "@/lib/api/companies";
import { getAllDeveloperSummaries } from "@/lib/data/mock-companies";
import {
  formatDate,
  priorityBadgeClass,
  priorityLabel,
  requirementStatusBadgeClass,
  requirementStatusLabel,
} from "../../../../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CurrentMatches } from "./_components/current-matches";
import { DeveloperPool } from "./_components/developer-pool";

const AllocationPage = ({
  params,
}: {
  params: Promise<{ id: string; reqId: string }>;
}) => {
  const { id: companyId, reqId } = use(params);
  const { getToken } = useAuth();
  const [requirement, setRequirement] = useState<JobRequirement | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await fetchCompanyRequirementAdmin(token, reqId);
    setRequirement(data);
    setLoading(false);
  }, [getToken, reqId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePropose = async (payload: {
    developerId: string;
    hourlyRate: number;
    monthlyRate: number;
    currency: string;
  }) => {
    const token = await getToken();
    const result = await proposeMatch(token, reqId, payload);

    const allDevs = getAllDeveloperSummaries();
    const dev = allDevs.find((d) => d.id === payload.developerId);
    if (!dev) return;

    const newMatch: ProposedMatch = result ?? {
      id: `match-${Date.now()}`,
      requirementId: reqId,
      developerId: payload.developerId,
      developer: dev,
      proposedHourlyRate: payload.hourlyRate,
      proposedMonthlyRate: payload.monthlyRate,
      currency: payload.currency,
      status: "proposed",
      proposedAt: new Date().toISOString(),
    };

    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: [...(prev.proposedMatches ?? []), newMatch],
      };
    });
  };

  const handleRemove = async (matchId: string) => {
    const token = await getToken();
    await removeMatch(token, matchId);
    setRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        proposedMatches: prev.proposedMatches?.filter(
          (m) => m.id !== matchId,
        ),
      };
    });
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
  const matchedDevIds = new Set(matches.map((m) => m.developerId));
  const acceptedCount = matches.filter(
    (m) => m.status === "accepted" || m.status === "active",
  ).length;
  const fillPct =
    requirement.developersNeeded > 0
      ? Math.round((acceptedCount / requirement.developersNeeded) * 100)
      : 0;

  return (
    <>
      {/* ── Back navigation ──────────────────────────────────────────── */}
      <Link
        href={`/admin/dashboard/companies/${companyId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Company
      </Link>

      {/* ── Header Card ──────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <h1 className="text-2xl font-semibold">{requirement.title}</h1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="capitalize">{requirement.experienceLevel} level</span>
            <span className="capitalize">
              {requirement.engagementType.replace("-", " ")}
            </span>
            <span>{requirement.timezonePreference.replace(/-/g, " ")}</span>
          </div>

          {/* Inline stat cards */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-lg border border-border/70 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Priority
              </p>
              <Badge
                variant="outline"
                className={`mt-1 ${priorityBadgeClass(requirement.priority)}`}
              >
                {priorityLabel[requirement.priority]}
              </Badge>
            </div>

            <div className="rounded-lg border border-border/70 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Badge
                variant="outline"
                className={`mt-1 ${requirementStatusBadgeClass(requirement.status)}`}
              >
                {requirementStatusLabel[requirement.status]}
              </Badge>
            </div>

            <div className="rounded-lg border border-border/70 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Budget
              </p>
              <p className="mt-1 font-mono text-sm font-semibold">
                {requirement.budgetMin && requirement.budgetMax
                  ? `$${requirement.budgetMin}–$${requirement.budgetMax}/hr`
                  : "Flexible"}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Start Date
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatDate(requirement.startDate)}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Team Size
              </p>
              <p className="mt-1 font-mono text-sm font-semibold">
                {acceptedCount}/{requirement.developersNeeded}
              </p>
              <Progress value={fillPct} className="mt-1.5 h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Description + Tech Stack ─────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {requirement.description}
          </p>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-1.5">
            {requirement.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Current Matches ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Current Matches</CardTitle>
              <p className="text-sm text-muted-foreground">
                {matches.length === 0
                  ? "No engineers matched yet."
                  : `${matches.length} engineer${matches.length !== 1 ? "s" : ""} matched.`}
              </p>
            </div>
            <DeveloperPool
              requirement={requirement}
              excludeDevIds={matchedDevIds}
              onPropose={handlePropose}
            />
          </div>
        </CardHeader>
        {matches.length > 0 && (
          <CardContent>
            <CurrentMatches
              matches={matches}
              onRemove={handleRemove}
            />
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default AllocationPage;
