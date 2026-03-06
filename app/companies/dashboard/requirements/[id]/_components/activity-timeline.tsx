"use client";

import {
  Briefcase,
  Check,
  ClipboardList,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import type { JobRequirement } from "@/lib/api/companies";

interface TimelineEvent {
  id: string;
  icon: React.ElementType;
  iconClass: string;
  label: string;
  detail?: string;
  date: string;
}

function deriveEvents(requirement: JobRequirement): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    id: "created",
    icon: ClipboardList,
    iconClass: "text-pulse bg-pulse/10",
    label: "Requirement posted",
    detail: requirement.title,
    date: requirement.createdAt,
  });

  for (const match of requirement.proposedMatches ?? []) {
    events.push({
      id: `proposed-${match.id}`,
      icon: Users,
      iconClass: "text-blue-600 bg-blue-500/10",
      label: "Match proposed",
      detail: match.developer.name,
      date: match.proposedAt,
    });

    if (match.respondedAt && match.status === "accepted") {
      events.push({
        id: `accepted-${match.id}`,
        icon: UserCheck,
        iconClass: "text-emerald-600 bg-emerald-500/10",
        label: "Developer accepted",
        detail: match.developer.name,
        date: match.respondedAt,
      });
    }

    if (match.respondedAt && match.status === "rejected") {
      events.push({
        id: `rejected-${match.id}`,
        icon: UserX,
        iconClass: "text-red-600 bg-red-500/10",
        label: "Company declined",
        detail: match.developer.name,
        date: match.respondedAt,
      });
    }

    if (match.respondedAt && match.status === "declined") {
      events.push({
        id: `declined-${match.id}`,
        icon: X,
        iconClass: "text-red-600 bg-red-500/10",
        label: "Developer declined",
        detail: match.developer.name,
        date: match.respondedAt,
      });
    }

    if (match.status === "active") {
      events.push({
        id: `active-${match.id}`,
        icon: Briefcase,
        iconClass: "text-emerald-600 bg-emerald-500/10",
        label: "Engagement started",
        detail: match.developer.name,
        date: match.respondedAt ?? match.proposedAt,
      });
    }

    if (match.status === "ended") {
      events.push({
        id: `ended-${match.id}`,
        icon: Check,
        iconClass: "text-muted-foreground bg-muted",
        label: "Engagement ended",
        detail: match.developer.name,
        date: match.respondedAt ?? match.proposedAt,
      });
    }
  }

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityTimeline({
  requirement,
}: {
  requirement: JobRequirement;
}) {
  const events = deriveEvents(requirement);

  if (events.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        Activity
      </p>
      <div className="relative space-y-0">
        {events.map((event, i) => {
          const Icon = event.icon;
          const isLast = i === events.length - 1;

          return (
            <div key={event.id} className="relative flex gap-3 pb-4">
              {!isLast && (
                <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
              )}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${event.iconClass}`}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 pt-1">
                <p className="text-sm font-medium">{event.label}</p>
                {event.detail && (
                  <p className="text-xs text-muted-foreground">
                    {event.detail}
                  </p>
                )}
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
