"use client";

import Link from "next/link";
import {
  Banknote,
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { OverviewActivityEvent } from "@/lib/api/admin";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityFeedProps {
  events: OverviewActivityEvent[];
}

const KIND_META: Record<
  OverviewActivityEvent["kind"],
  { icon: React.ComponentType<{ className?: string }>; tint: string }
> = {
  applicant_approved: { icon: CheckCircle2, tint: "text-emerald-600 bg-emerald-500/10" },
  applicant_rejected: { icon: XCircle, tint: "text-red-600 bg-red-500/10" },
  engagement_started: { icon: Briefcase, tint: "text-violet-600 bg-violet-500/10" },
  company_signed: { icon: Building2, tint: "text-sky-600 bg-sky-500/10" },
  invoice_paid: { icon: Banknote, tint: "text-emerald-600 bg-emerald-500/10" },
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - Date.parse(iso);
  if (diffMs < 60_000) return "just now";
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Vertical timeline of recent dashboard-worthy events. The backend rolls
 *  approvals, rejections, engagements, signups and paid invoices into one
 *  feed and sorts by timestamp — we just render it. */
export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Recent activity
        </p>
        {events.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Nothing happened in this window.
          </p>
        ) : (
          <ol className="mt-3 space-y-3">
            {events.map((e, i) => {
              const meta = KIND_META[e.kind];
              const Icon = meta.icon;
              const body = (
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${meta.tint}`}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{e.summary}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {relativeTime(e.at)}
                    </p>
                  </div>
                </div>
              );
              return (
                <li key={`${e.kind}-${e.at}-${i}`}>
                  {e.href ? (
                    <Link
                      href={e.href}
                      className="block rounded-md p-1 transition-colors hover:bg-muted/40"
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
