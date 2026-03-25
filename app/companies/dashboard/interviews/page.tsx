"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Video,
  Loader2,
} from "lucide-react";

import type { CompanyInterview } from "@/lib/api/companies";
import { fetchCompanyInterviews } from "@/lib/api/companies";
import {
  type InterviewStatus,
  interviewStatusLabel,
  interviewStatusBadgeClass,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      month: "short",
      day: "numeric",
    }) +
    ", " +
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

function isUpcoming(interview: CompanyInterview) {
  if (!interview.scheduledAt) return false;
  return (
    new Date(interview.scheduledAt) >= new Date() &&
    interview.status !== "completed" &&
    interview.status !== "declined"
  );
}

type TabFilter = "all" | "upcoming" | "past";

export default function InterviewsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabFilter>("all");

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
  const past = interviews.filter(
    (i) =>
      i.status === "completed" ||
      i.status === "declined" ||
      (i.scheduledAt && new Date(i.scheduledAt) < new Date()),
  );

  const kpis = [
    { label: "Total Interviews", value: String(interviews.length), icon: Video },
    { label: "Upcoming", value: String(upcoming.length), icon: CalendarDays },
    {
      label: "Completed",
      value: String(interviews.filter((i) => i.status === "completed").length),
      icon: Clock,
    },
  ];

  const tabFilters: { label: string; value: TabFilter; count: number }[] = [
    { label: "All", value: "all", count: interviews.length },
    { label: "Upcoming", value: "upcoming", count: upcoming.length },
    { label: "Past", value: "past", count: past.length },
  ];

  const filtered =
    tab === "upcoming" ? upcoming : tab === "past" ? past : interviews;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Interviews</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all candidate interviews.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                  <kpi.icon className="size-4 text-pulse" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="text-lg font-semibold">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {tabFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setTab(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === f.value
                ? "border-pulse/40 bg-pulse/10 text-pulse"
                : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Video className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No interviews yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Interviews will appear here when scheduled through your requirements.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 220 }}>
                  Candidate
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 200 }}>
                  Requirement
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Type
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 120 }}>
                  Status
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Outcome
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 150 }}>
                  Scheduled
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((interview) => (
                <TableRow
                  key={interview.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/companies/dashboard/interviews/${interview.id}`)
                  }
                >
                  <TableCell className="overflow-hidden" style={{ width: 220 }}>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage
                          src={interview.developerAvatar}
                          alt={interview.developerName}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(interview.developerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {interview.developerName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {interview.developerRole}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="overflow-hidden" style={{ width: 200 }}>
                    <span className="block truncate text-sm">
                      {interview.requirementTitle}
                    </span>
                  </TableCell>
                  <TableCell className="overflow-hidden" style={{ width: 100 }}>
                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${interviewTypeBadge(interview.type)}`}
                    >
                      {interview.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="overflow-hidden" style={{ width: 120 }}>
                    <Badge
                      variant="outline"
                      className={interviewStatusBadgeClass(interview.status as InterviewStatus)}
                    >
                      {interviewStatusLabel[interview.status as InterviewStatus] ??
                        interview.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="overflow-hidden" style={{ width: 100 }}>
                    {interview.outcome ? (
                      <Badge
                        variant="outline"
                        className={`capitalize ${outcomeBadge(interview.outcome)}`}
                      >
                        {interview.outcome}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="overflow-hidden" style={{ width: 150 }}>
                    {interview.scheduledAt ? (
                      <span className="font-mono text-sm text-muted-foreground">
                        {formatDateTime(interview.scheduledAt)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Pending
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-muted-foreground">
              {filtered.length} interview{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
