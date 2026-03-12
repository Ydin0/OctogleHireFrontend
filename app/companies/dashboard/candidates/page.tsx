"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ChevronRight, Loader2, UserSearch } from "lucide-react";

import {
  type JobRequirement,
  type MatchStatus,
  type ProposedMatch,
  fetchCompanyRequirements,
} from "@/lib/api/companies";
import {
  matchStatusLabel,
  matchStatusBadgeClass,
  formatDate,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

type CandidateStatusFilter = "all" | MatchStatus;

interface FlatCandidate {
  match: ProposedMatch;
  requirementTitle: string;
  requirementId: string;
}

export default function CandidatesPage() {
  const { getToken } = useAuth();
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CandidateStatusFilter>("all");

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const data = await fetchCompanyRequirements(token);
      if (data) setRequirements(data);
      setLoading(false);
    }
    load();
  }, [getToken]);

  // Flatten all proposed matches across requirements
  const candidates: FlatCandidate[] = useMemo(() => {
    const flat: FlatCandidate[] = [];
    for (const req of requirements) {
      for (const match of req.proposedMatches ?? []) {
        flat.push({
          match,
          requirementTitle: req.title,
          requirementId: req.id,
        });
      }
    }
    // Sort: accepted (to review) first, then by proposedAt desc
    flat.sort((a, b) => {
      if (a.match.status === "accepted" && b.match.status !== "accepted") return -1;
      if (b.match.status === "accepted" && a.match.status !== "accepted") return 1;
      return new Date(b.match.proposedAt).getTime() - new Date(a.match.proposedAt).getTime();
    });
    return flat;
  }, [requirements]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return candidates;
    return candidates.filter((c) => c.match.status === statusFilter);
  }, [candidates, statusFilter]);

  // Count per status for filter pills
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: candidates.length };
    for (const c of candidates) {
      counts[c.match.status] = (counts[c.match.status] ?? 0) + 1;
    }
    return counts;
  }, [candidates]);

  // Build filter options from statuses that actually exist
  const filterOptions: { label: string; value: CandidateStatusFilter; count: number }[] = useMemo(() => {
    const opts: { label: string; value: CandidateStatusFilter; count: number }[] = [
      { label: "All", value: "all", count: candidates.length },
    ];
    const order: MatchStatus[] = [
      "accepted",
      "proposed",
      "interview_requested",
      "interview_scheduled",
      "active",
      "declined",
      "rejected",
      "ended",
    ];
    for (const status of order) {
      const count = statusCounts[status];
      if (count && count > 0) {
        opts.push({
          label: matchStatusLabel[status],
          value: status,
          count,
        });
      }
    }
    return opts;
  }, [candidates.length, statusCounts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            All proposed candidates across your open requirements.
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? "border-pulse/40 bg-pulse/10 text-pulse"
                : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Candidates Table */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <UserSearch className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No candidates found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {candidates.length === 0
                ? "Candidates will appear here once they are matched to your requirements."
                : "No candidates match this filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead>Proposed</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const dev = c.match.developer;
                  return (
                    <TableRow key={c.match.id} className="group">
                      <TableCell>
                        <Link
                          href={`/companies/dashboard/developers/${c.match.developerId}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar className="size-8 shrink-0">
                            <AvatarImage src={dev?.avatar} alt={dev?.name ?? ""} />
                            <AvatarFallback className="text-[10px]">
                              {dev?.name ? getInitials(dev.name) : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium group-hover:underline">
                              {dev?.name ?? "Unknown"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {dev?.role ?? ""}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {dev?.location ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/companies/dashboard/requirements/${c.requirementId}`}
                          className="text-sm hover:underline"
                        >
                          {c.requirementTitle}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={matchStatusBadgeClass(c.match.status)}
                        >
                          {matchStatusLabel[c.match.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono text-sm">
                          {formatCurrency(c.match.proposedHourlyRate)}/hr
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(c.match.proposedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/companies/dashboard/developers/${c.match.developerId}`}>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {filtered.length} of {candidates.length} candidates
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
