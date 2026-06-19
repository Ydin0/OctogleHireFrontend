"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Coins,
  Loader2,
  Users,
  UserSearch,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  type JobRequirement,
  type MatchStatus,
  type ProposedMatch,
  fetchCompanyRequirements,
  respondToMatch,
} from "@/lib/api/companies";
import { formatDate } from "@/app/admin/dashboard/_components/dashboard-data";
import { formatRate } from "@/lib/utils/format-rate";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Mono,
  PageHead,
  PageScroll,
  StatusPill,
  SummaryStat,
} from "../_components/console-ui";

type CandidateStatusFilter = "all" | MatchStatus;

interface FlatCandidate {
  match: ProposedMatch;
  requirementTitle: string;
  requirementId: string;
}

// Monthly estimate: prefer the proposed monthly rate; otherwise derive from the
// hourly rate × the proposed hours/day × working days/month (falling back to a
// standard 160-hour month) so we never show a hardcoded figure.
function monthlyEstimate(m: ProposedMatch): number {
  if (m.proposedMonthlyRate > 0) return m.proposedMonthlyRate;
  if (m.hoursPerDay && m.workingDaysPerMonth)
    return m.proposedHourlyRate * m.hoursPerDay * m.workingDaysPerMonth;
  return m.proposedHourlyRate * 160;
}

function CandidateCard({
  c,
  busy,
  onOpen,
  onRespond,
}: {
  c: FlatCandidate;
  busy: boolean;
  onOpen: () => void;
  onRespond: (action: "accepted" | "rejected") => void;
}) {
  const dev = c.match.developer;
  const canRespond = c.match.status === "accepted";
  const monthly = monthlyEstimate(c.match);
  const type =
    c.match.hoursPerDay && c.match.workingDaysPerMonth
      ? `${c.match.hoursPerDay}h × ${c.match.workingDaysPerMonth}d`
      : "full-time";

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap gap-4 p-5">
        <button onClick={onOpen} className="shrink-0">
          <span className="inline-flex size-[58px] overflow-hidden rounded-full border border-border bg-muted">
            {dev?.avatar ? (
              <Image
                src={dev.avatar}
                alt={dev.name}
                width={58}
                height={58}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                {dev?.name?.slice(0, 1) ?? "?"}
              </span>
            )}
          </span>
        </button>

        <div className="min-w-[240px] flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <button
                onClick={onOpen}
                className="text-base font-semibold hover:underline"
              >
                {dev?.name ?? "Unknown"}
              </button>
              <div className="text-[12.5px] text-pulse">
                {dev?.role}
                {" · "}
                <Link
                  href={`/companies/dashboard/requirements/${c.requirementId}`}
                  className="hover:underline"
                >
                  {c.requirementTitle}
                </Link>
              </div>
            </div>
            <StatusPill status={c.match.status} />
          </div>

          <div className="mt-3.5 flex flex-wrap gap-6">
            {[
              ["Proposed", formatDate(c.match.proposedAt)],
              ["Rate", `${formatRate(c.match.proposedHourlyRate, c.match.currency)}/hr`],
              ["Monthly est.", `${formatRate(monthly, c.match.currency)}/mo`],
              ["Type", type],
            ].map(([k, v]) => (
              <div key={k}>
                <Mono className="mb-1 block text-[9px] text-muted-foreground">{k}</Mono>
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    (k === "Rate" || k === "Monthly est.") && "font-mono",
                  )}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-full">
              <Link href={`/companies/dashboard/developers/${c.match.developerId}`}>
                View profile
              </Link>
            </Button>
            {canRespond && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy}
                  onClick={() => onRespond("accepted")}
                >
                  {busy ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy}
                  onClick={() => onRespond("rejected")}
                >
                  <X className="size-3.5" /> Pass
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CandidateStatusFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const data = await fetchCompanyRequirements(token);
      if (data) setRequirements(data);
      setLoading(false);
    }
    load();
  }, [getToken]);

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
    flat.sort((a, b) => {
      // Decision-needed (developer accepted) first, then most recent.
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

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of candidates) {
      counts[c.match.status] = (counts[c.match.status] ?? 0) + 1;
    }
    return counts;
  }, [candidates]);

  const decisionNeeded = statusCounts["accepted"] ?? 0;
  const inProcess =
    (statusCounts["interview_requested"] ?? 0) +
    (statusCounts["interview_scheduled"] ?? 0) +
    (statusCounts["active"] ?? 0);
  const roleCount = useMemo(
    () => new Set(candidates.map((c) => c.requirementId)).size,
    [candidates],
  );

  const filterOptions: { label: string; value: CandidateStatusFilter; count: number }[] =
    useMemo(() => {
      const opts: { label: string; value: CandidateStatusFilter; count: number }[] = [
        { label: "All", value: "all", count: candidates.length },
      ];
      const order: { status: MatchStatus; label: string }[] = [
        { status: "accepted", label: "Awaiting your decision" },
        { status: "proposed", label: "Proposed" },
        { status: "interview_requested", label: "Interview requested" },
        { status: "interview_scheduled", label: "Interview scheduled" },
        { status: "active", label: "Active" },
        { status: "declined", label: "Declined" },
        { status: "rejected", label: "Passed" },
        { status: "ended", label: "Ended" },
      ];
      for (const { status, label } of order) {
        const count = statusCounts[status];
        if (count && count > 0) opts.push({ label, value: status, count });
      }
      return opts;
    }, [candidates.length, statusCounts]);

  const handleRespond = async (
    match: ProposedMatch,
    action: "accepted" | "rejected",
  ) => {
    setBusyId(match.id);
    const token = await getToken();
    const res = await respondToMatch(token, match.id, action);
    setBusyId(null);
    if (!res) {
      toast.error("Couldn't update — you may need a signed MSA first.");
      return;
    }
    toast.success(action === "accepted" ? "Candidate accepted" : "Candidate passed");
    // Reflect the new status locally without a full reload.
    setRequirements((prev) =>
      prev.map((req) => ({
        ...req,
        proposedMatches: (req.proposedMatches ?? []).map((m) =>
          m.id === match.id ? { ...m, status: res.status } : m,
        ),
      })),
    );
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PageScroll>
      <PageHead
        eyebrow="Candidates"
        title="Proposed candidates"
        subtitle="Engineers your account manager has put forward across your open roles. Accept to move them into hiring, or pass to free up the slot."
      />

      {candidates.length > 0 ? (
        <>
          <div className="mb-6 flex flex-wrap gap-3.5">
            <SummaryStat
              icon={<Users className="size-4" />}
              value={candidates.length}
              label="Proposed candidates"
            />
            <SummaryStat
              icon={<Check className="size-4" />}
              value={decisionNeeded}
              label="Awaiting your decision"
              accent
            />
            <SummaryStat
              icon={<ArrowRight className="size-4" />}
              value={inProcess}
              label="In process"
            />
            <SummaryStat
              icon={<Coins className="size-4" />}
              value={roleCount}
              label="Roles with candidates"
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
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

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {filtered.map((c) => (
                <CandidateCard
                  key={c.match.id}
                  c={c}
                  busy={busyId === c.match.id}
                  onOpen={() =>
                    router.push(
                      `/companies/dashboard/developers/${c.match.developerId}`,
                    )
                  }
                  onRespond={(action) => handleRespond(c.match, action)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<UserSearch className="size-6" />}
              title="No candidates match this filter"
              body="Try a different status filter to see more of your proposed candidates."
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={<UserSearch className="size-6" />}
          title="No candidates yet"
          body="Candidates appear here once your account manager matches vetted engineers to your open roles — typically within 48 hours."
          action={
            <Button asChild className="rounded-full">
              <Link href="/companies/dashboard/requirements/new">Post a role</Link>
            </Button>
          }
        />
      )}
    </PageScroll>
  );
}
