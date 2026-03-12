"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Video,
  Loader2,
  ChevronRight,
} from "lucide-react";

import type { CompanyInterview } from "@/lib/api/companies";
import { fetchCompanyInterviews } from "@/lib/api/companies";
import {
  type InterviewStatus,
  interviewStatusLabel,
  interviewStatusBadgeClass,
  formatDate,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) +
    " at " +
    d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
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

function isUpcoming(interview: CompanyInterview) {
  if (!interview.scheduledAt) return false;
  return (
    new Date(interview.scheduledAt) >= new Date() &&
    interview.status !== "completed" &&
    interview.status !== "declined"
  );
}

function isPast(interview: CompanyInterview) {
  if (interview.status === "completed" || interview.status === "declined")
    return true;
  if (interview.scheduledAt && new Date(interview.scheduledAt) < new Date())
    return true;
  return false;
}

function InterviewCard({ interview }: { interview: CompanyInterview }) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() =>
        router.push(
          `/companies/dashboard/interviews/${interview.id}`,
        )
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push(
            `/companies/dashboard/interviews/${interview.id}`,
          );
      }}
      className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={interview.developerAvatar} alt={interview.developerName} />
        <AvatarFallback className="text-xs">
          {getInitials(interview.developerName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">
            {interview.developerName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {interview.developerRole}
          </span>
        </div>

        <p className="truncate text-xs text-muted-foreground">
          {interview.requirementTitle}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[10px] ${interviewTypeBadge(interview.type)}`}
          >
            {interview.type}
          </Badge>
          <Badge
            variant="outline"
            className={`text-[10px] ${interviewStatusBadgeClass(interview.status as InterviewStatus)}`}
          >
            {interviewStatusLabel[interview.status as InterviewStatus] ??
              interview.status}
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

      <div className="hidden shrink-0 items-center gap-4 sm:flex">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Scheduled
          </p>
          {interview.scheduledAt ? (
            <p className="font-mono text-xs">
              {formatDateTime(interview.scheduledAt)}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Pending</p>
          )}
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export default function InterviewsPage() {
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const data = await fetchCompanyInterviews(token);
      setInterviews(data ?? []);
      setLoading(false);
    }
    load();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const upcoming = interviews.filter(isUpcoming);
  const past = interviews.filter(isPast);

  const kpis = [
    {
      label: "Total Interviews",
      value: String(interviews.length),
      icon: Video,
    },
    {
      label: "Upcoming",
      value: String(upcoming.length),
      icon: CalendarDays,
    },
    {
      label: "Completed",
      value: String(
        interviews.filter((i) => i.status === "completed").length,
      ),
      icon: Clock,
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Interviews</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all candidate interviews.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-accent">
                  <kpi.icon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className="text-lg font-semibold">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Interview List */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All ({interviews.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({past.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-3">
              {interviews.length === 0 ? (
                <EmptyState />
              ) : (
                interviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4 space-y-3">
              {upcoming.length === 0 ? (
                <EmptyState message="No upcoming interviews." />
              ) : (
                upcoming.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-4 space-y-3">
              {past.length === 0 ? (
                <EmptyState message="No past interviews." />
              ) : (
                past.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

function EmptyState({
  message = "No interviews yet.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Video className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">
        {message}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Interviews will appear here when scheduled through your requirements.
      </p>
    </div>
  );
}
