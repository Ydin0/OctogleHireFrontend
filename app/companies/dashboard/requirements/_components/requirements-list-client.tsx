"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Loader2,
  Plus,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

import {
  type JobRequirement,
  type ProposedMatch,
  fetchCompanyRequirements,
} from "@/lib/api/companies";
import {
  formatDate,
  priorityBadgeClass,
  priorityLabel,
  requirementStatusBadgeClass,
  requirementStatusLabel,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { CountryFlags } from "@/lib/utils/country-flags";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function countToReview(req: JobRequirement): number {
  return (req.proposedMatches ?? []).filter((m) => m.status === "accepted").length;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type StatusFilter = "all" | "open" | "closed" | "filled";

const RequirementsListClient = () => {
  const { getToken } = useAuth();
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const data = await fetchCompanyRequirements(token);
      if (data) setRequirements(data);
      setLoading(false);
    };
    load();
  }, [getToken]);

  const openCount = requirements.filter(
    (r) => r.status === "open",
  ).length;
  const matchingCount = requirements.filter(
    (r) => r.status === "matching" || r.status === "partially_filled",
  ).length;
  const filledCount = requirements.filter(
    (r) => r.status === "filled",
  ).length;
  const totalToReview = requirements.reduce((sum, r) => sum + countToReview(r), 0);

  const kpis = [
    { label: "To Review", value: String(totalToReview), icon: Bell, highlight: totalToReview > 0 },
    { label: "Open", value: String(openCount), icon: Clock, highlight: false },
    { label: "Matching", value: String(matchingCount), icon: Search, highlight: false },
    { label: "Filled", value: String(filledCount), icon: CheckCircle2, highlight: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Sort: requirements with reviews first, then by date
  const sorted = [...requirements].sort((a, b) => {
    const aReview = countToReview(a);
    const bReview = countToReview(b);
    if (aReview > 0 && bReview === 0) return -1;
    if (bReview > 0 && aReview === 0) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const closedCount = requirements.filter((r) => r.status === "closed").length;
  const activeCount = requirements.filter(
    (r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled",
  ).length;

  const statusFilters: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: requirements.length },
    { label: "Active", value: "open", count: activeCount },
    { label: "Filled", value: "filled", count: filledCount },
    { label: "Closed", value: "closed", count: closedCount },
  ];

  const filteredRequirements = statusFilter === "all"
    ? sorted
    : statusFilter === "open"
      ? sorted.filter((r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled")
      : sorted.filter((r) => r.status === statusFilter);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Requirements</h1>
          <p className="text-sm text-muted-foreground">
            Post development requirements and track engineer matches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/companies/dashboard/requirements/discover">
              <Download className="size-4" />
              Discover Jobs
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/companies/dashboard/requirements/new">
              <Plus className="size-4" />
              Post New Requirement
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-accent"}`}>
                  <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className={`text-lg font-semibold ${kpi.highlight ? "text-amber-600" : ""}`}>{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="mx-auto mb-3 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {requirements.length === 0
                  ? 'No requirements posted yet. Click "Post New Requirement" to get started.'
                  : "No requirements match this filter."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequirements.map((req) => (
            <RequirementCard key={req.id} req={req} />
          ))
        )}
      </div>
    </>
  );
};

function formatBudget(min?: number, max?: number, budgetType?: string): string | null {
  if (min == null && max == null) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  const suffix = budgetType === "annual" ? "/yr" : budgetType === "monthly" ? "/mo" : "/hr";
  if (min != null && max != null) return `${fmt(min)}–${fmt(max)}${suffix}`;
  if (min != null) return `${fmt(min)}+${suffix}`;
  return `up to ${fmt(max!)}${suffix}`;
}

function RequirementCard({ req }: { req: JobRequirement }) {
  const matches = req.proposedMatches ?? [];
  const reviewCount = countToReview(req);
  const activeCount = matches.filter((m) => m.status === "active").length;
  const hasReviews = reviewCount > 0;

  const toReviewMatches = matches.filter((m) => m.status === "accepted");
  const otherMatches = matches.filter((m) => m.status !== "accepted" && m.status !== "rejected");
  const avatarMatches = [...toReviewMatches, ...otherMatches];
  const budget = formatBudget(req.budgetMin, req.budgetMax, req.budgetType);

  return (
    <Link
      href={`/companies/dashboard/requirements/${req.id}`}
      className="group block"
    >
      <Card className={`transition-all hover:border-foreground/15 hover:shadow-sm ${hasReviews ? "border-amber-500/35" : ""}`}>
        <CardContent className="p-4 lg:p-5">
          {/* Top row: title + badges + avatar stack */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-start gap-x-3 gap-y-2 min-w-0">
              <h3 className="text-base font-semibold tracking-tight">
                {req.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={requirementStatusBadgeClass(req.status)}
                >
                  {requirementStatusLabel[req.status]}
                </Badge>
                <Badge
                  variant="outline"
                  className={priorityBadgeClass(req.priority)}
                >
                  {priorityLabel[req.priority]}
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {avatarMatches.length > 0 && <AvatarStack matches={avatarMatches} />}
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{matches.length}</span>{" "}
                match{matches.length !== 1 ? "es" : ""}
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>
              {req.experienceYearsMin != null && req.experienceYearsMax != null
                ? `${req.experienceYearsMin}–${req.experienceYearsMax} yrs exp`
                : <span className="capitalize">{req.experienceLevel} level</span>}
            </span>
            <span className="text-border">|</span>
            <span className="capitalize">{req.engagementType?.replace("-", " ") ?? "-"}</span>
            <span className="text-border">|</span>
            <span>Start {formatDate(req.startDate)}</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {activeCount}/{req.developersNeeded} filled
            </span>
            {budget && (
              <>
                <span className="text-border">|</span>
                <span className="font-mono">{budget}</span>
              </>
            )}
          </div>

          {/* Tech stack + flags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {req.techStack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
            {req.techStack.length > 5 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{req.techStack.length - 5}
              </Badge>
            )}
            {req.hiringCountries?.length > 0 && (
              <CountryFlags codes={req.hiringCountries} max={4} />
            )}
          </div>

          {/* Review alert */}
          {hasReviews && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/8 px-3 py-1.5">
              <UserCheck className="size-3.5 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                {reviewCount} developer{reviewCount !== 1 ? "s" : ""} awaiting your review
              </span>
              <ArrowRight className="size-3 text-amber-600" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function AvatarStack({ matches }: { matches: ProposedMatch[] }) {
  const visible = matches.slice(0, 4);
  const remaining = matches.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => {
        const dev = m.developer;
        const isToReview = m.status === "accepted";

        return (
          <Avatar
            key={m.id}
            className={`size-9 border-2 border-background ${isToReview ? "ring-2 ring-amber-400" : ""}`}
          >
            <AvatarImage src={dev?.avatar} alt={dev?.name ?? ""} className="object-cover" />
            <AvatarFallback className="text-[10px] font-medium">
              {dev?.name ? getInitials(dev.name) : "?"}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {remaining > 0 && (
        <div className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
          +{remaining}
        </div>
      )}
    </div>
  );
}

export { RequirementsListClient };
