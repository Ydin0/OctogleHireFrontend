"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Settings2,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";

import {
  type JobRequirement,
  type ProposedMatch,
  respondToMatch,
} from "@/lib/api/companies";
import { TECH_ICONS } from "@/lib/tech-icons";
import { formatRate } from "@/lib/utils/format-rate";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Chip,
  EmptyState,
  Mono,
  StatusPill,
} from "../../_components/console-ui";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

const VISIBLE_MATCH_STATUSES = new Set([
  "accepted",
  "interview_requested",
  "interview_scheduled",
  "active",
]);

function visibleMatches(req: JobRequirement): ProposedMatch[] {
  return (req.proposedMatches ?? []).filter((m) =>
    VISIBLE_MATCH_STATUSES.has(m.status),
  );
}

function RoleListItem({
  req,
  active,
  onClick,
}: {
  req: JobRequirement;
  active: boolean;
  onClick: () => void;
}) {
  const count = visibleMatches(req).length;
  const hasReady = count > 0;
  return (
    <button
      onClick={onClick}
      className={cn(
        "mb-2.5 block w-full rounded-2xl border p-3.5 text-left transition-colors",
        active
          ? "border-pulse/45 bg-pulse/10"
          : hasReady
            ? "border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20 hover:border-emerald-500/60"
            : "border-border bg-card/50 hover:border-pulse/30",
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <span
          className={cn(
            "flex items-center gap-2 text-sm font-semibold",
            active ? "text-pulse" : "text-foreground",
          )}
        >
          {hasReady && (
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
          )}
          {req.title}
        </span>
        <StatusPill status={req.status} />
      </div>
      <div className="my-2.5 flex flex-wrap gap-1.5">
        {req.techStack.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11.5px]">
        {hasReady ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-3" strokeWidth={3} />
            {count} ready to review
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3" /> No candidates yet
          </span>
        )}
        <Mono className="text-[9.5px] text-muted-foreground">{timeAgo(req.createdAt)}</Mono>
      </div>
    </button>
  );
}

function MatchRow({
  match,
  busy,
  onOpen,
  onAccept,
  onReject,
}: {
  match: ProposedMatch;
  busy: boolean;
  onOpen: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  const d = match.developer;
  const canRespond = match.status === "accepted";
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-8 py-4">
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="inline-flex size-11 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {d.avatar ? (
            <Image src={d.avatar} alt={d.name} width={44} height={44} className="size-full object-cover" unoptimized />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-semibold text-muted-foreground">
              {d.name.slice(0, 1)}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{d.name}</div>
          <div className="truncate text-xs text-pulse">{d.role}</div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {d.location}
          </div>
        </div>
      </button>
      <div className="text-right">
        {match.proposedMonthlyRate > 0 ? (
          <>
            <div className="font-mono text-sm font-semibold">
              {formatRate(match.proposedMonthlyRate, match.currency)}
              <span className="text-[10px] font-normal text-muted-foreground">/mo</span>
            </div>
            <div className="font-mono text-[10.5px] text-muted-foreground">
              {formatRate(match.proposedHourlyRate, match.currency)}/hr
              {match.hoursPerDay && match.workingDaysPerMonth
                ? ` · ${match.hoursPerDay}h × ${match.workingDaysPerMonth}d`
                : ""}
            </div>
          </>
        ) : (
          <div className="font-mono text-sm font-semibold">
            {formatRate(match.proposedHourlyRate, match.currency)}
            <span className="text-[10px] font-normal text-muted-foreground">/hr</span>
          </div>
        )}
        <div className="mt-1">
          <StatusPill status={match.status} />
        </div>
      </div>
      {canRespond ? (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={onReject}>
            <X className="size-3.5" /> Pass
          </Button>
          <Button size="sm" className="rounded-full" disabled={busy} onClick={onAccept}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Accept
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" className="rounded-full" onClick={onOpen}>
          View
        </Button>
      )}
    </div>
  );
}

export function RolesConsole({
  requirements,
}: {
  requirements: JobRequirement[];
}) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [selId, setSelId] = useState<string | null>(
    requirements[0]?.id ?? null,
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const sel = useMemo(
    () => requirements.find((r) => r.id === selId) ?? requirements[0] ?? null,
    [requirements, selId],
  );
  const matches = sel ? visibleMatches(sel) : [];

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
    router.refresh();
  };

  if (requirements.length === 0) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-xl px-8 py-20">
          <EmptyState
            icon={<Target className="size-6" />}
            title="Post your first role"
            body="Describe who you need and your account manager will hand-deliver vetted, interview-ready candidates — no algorithms, real humans matching real engineers."
            action={
              <Button asChild className="rounded-full">
                <Link href="/companies/dashboard/requirements/new">
                  <Plus className="size-4" /> New requirement
                </Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_1fr]">
      {/* roles list */}
      <div className="flex min-h-0 flex-col border-r border-border bg-card/30">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4.5 py-3.5">
          <Mono className="text-[10.5px] text-muted-foreground">
            Your roles · {requirements.length}
          </Mono>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/companies/dashboard/requirements/new">
              <Plus className="size-3.5" /> New
            </Link>
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {requirements.map((r) => (
            <RoleListItem
              key={r.id}
              req={r}
              active={sel?.id === r.id}
              onClick={() => setSelId(r.id)}
            />
          ))}
        </div>
      </div>

      {/* brief + matches */}
      <div className="min-h-0 overflow-y-auto bg-background">
        {sel && (
          <>
            <div className="border-b border-border bg-gradient-to-br from-pulse/7 to-card px-8 pb-5 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Mono className="mb-1.5 block text-[10px] text-pulse">Brief</Mono>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {sel.title}
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={`/companies/dashboard/requirements/${sel.id}`}>
                    <Settings2 className="size-3.5" /> Manage role
                  </Link>
                </Button>
              </div>
              <p className="mb-3.5 mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {sel.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {sel.techStack.map((s) => (
                  <Chip key={s}>
                    {TECH_ICONS[s] && (
                      <Image src={TECH_ICONS[s]} alt="" width={12} height={12} unoptimized />
                    )}
                    {s}
                  </Chip>
                ))}
                <Chip>{sel.experienceLevel}</Chip>
                {sel.budgetMax != null && (
                  <Chip>≤ {formatRate(sel.budgetMax, sel.budgetCurrency)}/hr</Chip>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-8 pb-1.5 pt-4">
              <Mono className="text-[10.5px] text-muted-foreground">
                Account-manager matches
              </Mono>
              <Mono className="text-[10px] text-pulse">
                {matches.length} ready
              </Mono>
            </div>

            {matches.length > 0 ? (
              <div className="border-t border-border">
                {matches.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    busy={busyId === m.id}
                    onOpen={() =>
                      router.push(
                        `/companies/dashboard/developers/${m.developerId}`,
                      )
                    }
                    onAccept={() => handleRespond(m, "accepted")}
                    onReject={() => handleRespond(m, "rejected")}
                  />
                ))}
              </div>
            ) : (
              <div className="px-8 py-12">
                <EmptyState
                  icon={<Loader2 className="size-6 animate-spin" />}
                  title="Matching in progress"
                  body="Your account manager is reviewing this brief and hand-picking vetted engineers. Candidates appear here as they're matched — typically within 48 hours."
                  action={null}
                />
              </div>
            )}

            <div className="mx-8 mb-10 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-pulse/28 bg-gradient-to-br from-pulse/8 to-card p-4">
              <span className="inline-flex items-center gap-3 text-[13.5px] text-muted-foreground">
                <ShieldCheck className="size-5 text-pulse" /> Want us to do the
                shortlisting? We hand-deliver 3–5 interview-ready profiles within
                48 hours.
              </span>
              <Button asChild size="sm" className="rounded-full">
                <Link href={`/companies/dashboard/requirements/${sel.id}`}>
                  Request curated shortlist <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
