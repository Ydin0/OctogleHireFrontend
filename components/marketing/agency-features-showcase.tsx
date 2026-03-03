"use client";

import { useEffect, useState } from "react";
import { Copy, Link as LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AgencyFeaturesShowcaseProps {
  className?: string;
}

// ── Referral Link Mockup ─────────────────────────────────────────────────────
const ReferralLinkMockup = () => {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => (c >= 47 ? 0 : c + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Referral Link</p>
        <Badge variant="outline" className="text-[10px]">
          Active
        </Badge>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
        <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate font-mono text-xs">
          octoglehire.com/apply/a/acme-recruit
        </span>
        <button
          onClick={() => setCopied(true)}
          className="shrink-0 rounded-md p-1.5 transition-colors hover:bg-background"
        >
          <Copy
            className={cn(
              "size-3.5 transition-colors",
              copied ? "text-emerald-500" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <span className="text-xs text-muted-foreground">
          Candidates submitted
        </span>
        <span className="font-mono text-lg font-semibold text-pulse">
          {count}
        </span>
      </div>
    </div>
  );
};

// ── Commission Tracking Mockup ───────────────────────────────────────────────
const CommissionTrackingMockup = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const totalEarned = 12400 + tick * 38;
  const pending = 3200 + Math.floor(tick * 12);
  const paid = totalEarned - pending;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Commission Overview</p>
        <Badge variant="outline" className="text-[10px]">
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Earned", value: totalEarned, accent: true },
          { label: "Pending", value: pending, accent: false },
          { label: "Paid", value: paid, accent: false },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-border p-3 text-center"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-sm font-semibold",
                item.accent && "text-pulse",
              )}
            >
              ${item.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Candidate Pipeline Mockup ────────────────────────────────────────────────
const PIPELINE_STATUSES = ["Submitted", "Interviewing", "Placed"] as const;

const STATUS_STYLES: Record<
  (typeof PIPELINE_STATUSES)[number],
  string
> = {
  Submitted: "bg-muted text-muted-foreground",
  Interviewing: "bg-amber-500/10 text-amber-600",
  Placed: "bg-emerald-500/10 text-emerald-600",
};

const candidates = [
  { name: "Arjun Kumar", role: "Senior React Engineer" },
  { name: "Priya Sharma", role: "Backend Python Engineer" },
  { name: "Rohan Mehta", role: "Frontend Engineer" },
  { name: "Neha Tiwari", role: "DevOps Engineer" },
];

const CandidatePipelineMockup = () => {
  const [statusIndices, setStatusIndices] = useState([0, 1, 2, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndices((prev) =>
        prev.map((idx) => (idx + 1) % PIPELINE_STATUSES.length),
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <p className="text-sm font-semibold">Candidate Pipeline</p>
        <Badge variant="outline" className="text-[10px]">
          {candidates.length} candidates
        </Badge>
      </div>

      {candidates.map((candidate, i) => {
        const status = PIPELINE_STATUSES[statusIndices[i]];
        return (
          <div
            key={candidate.name}
            className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
            style={{
              animationDelay: `${i * 100}ms`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{candidate.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {candidate.role}
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all duration-500",
                STATUS_STYLES[status],
              )}
            >
              {status}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Main Section ─────────────────────────────────────────────────────────────
const AgencyFeaturesShowcase = ({
  className,
}: AgencyFeaturesShowcaseProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Agency Marketplace
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl xl:text-6xl">
          Your own branded pipeline, powered by OctogleHire
        </h2>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 1 — Referral Link */}
        <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
          <div className="rounded-2xl bg-background border border-border p-4">
            <ReferralLinkMockup />
          </div>
          <div className="space-y-2 px-2">
            <h3 className="text-lg font-semibold">
              Your Branded Application Link
            </h3>
            <p className="text-sm text-muted-foreground">
              Get a unique referral URL for your agency. Every candidate who
              applies through your link is automatically attributed to you —
              no manual tracking required.
            </p>
          </div>
        </div>

        {/* Card 2 — Commission Tracking */}
        <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
          <div className="rounded-2xl bg-background border border-border p-4">
            <CommissionTrackingMockup />
          </div>
          <div className="space-y-2 px-2">
            <h3 className="text-lg font-semibold">
              Real-Time Commission Tracking
            </h3>
            <p className="text-sm text-muted-foreground">
              See your earnings update in real-time. Track total earned,
              pending, and paid commissions — fully transparent with no
              hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom row — Pipeline */}
      <div className="mt-4 rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pipeline Management
            </span>
            <h3 className="text-3xl font-medium tracking-tight">
              Track every candidate from submission to placement
            </h3>
            <p className="text-muted-foreground">
              Your agency dashboard gives you full visibility into the status
              of every candidate you&apos;ve submitted. See who&apos;s been
              shortlisted, who&apos;s interviewing, and who&apos;s been placed
              — all in one view.
            </p>
          </div>

          <CandidatePipelineMockup />
        </div>
      </div>
    </section>
  );
};

export { AgencyFeaturesShowcase };
