"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Loader2,
  Plus,
  Search,
  Users,
} from "lucide-react";

import {
  type JobRequirement,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function countToReview(req: JobRequirement): number {
  return (req.proposedMatches ?? []).filter((m) => m.status === "accepted").length;
}

type StatusFilter = "all" | "open" | "closed" | "filled";

const RequirementsListClient = () => {
  const { getToken } = useAuth();
  const router = useRouter();
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
                <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}>
                  <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`} />
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
                ? "border-pulse/40 bg-pulse/10 text-pulse"
                : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

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
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 280 }}>
                  Requirement
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Status
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Priority
                </TableHead>
                <TableHead className="text-xs text-muted-foreground text-center" style={{ width: 100 }}>
                  Candidates
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 140 }}>
                  Budget
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Countries
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Type
                </TableHead>
                <TableHead className="text-xs text-muted-foreground" style={{ width: 100 }}>
                  Posted
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequirements.map((req) => {
                const matches = req.proposedMatches ?? [];
                const reviewCount = countToReview(req);
                const activeMatchCount = matches.filter((m) => m.status === "active").length;

                return (
                  <TableRow
                    key={req.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/companies/dashboard/requirements/${req.id}`)}
                  >
                    <TableCell className="overflow-hidden" style={{ width: 280 }}>
                      <div className="space-y-1">
                        <p className="truncate text-sm font-medium">
                          {req.title}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {req.techStack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                              {tech}
                            </Badge>
                          ))}
                          {req.techStack.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{req.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 100 }}>
                      <Badge
                        variant="outline"
                        className={requirementStatusBadgeClass(req.status)}
                      >
                        {requirementStatusLabel[req.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 100 }}>
                      <Badge
                        variant="outline"
                        className={priorityBadgeClass(req.priority)}
                      >
                        {priorityLabel[req.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell className="overflow-hidden text-center" style={{ width: 100 }}>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="flex items-center gap-1 text-sm font-medium">
                          <Users className="size-3 text-muted-foreground" />
                          {activeMatchCount}/{req.developersNeeded}
                        </span>
                        {reviewCount > 0 && (
                          <span className="text-[10px] font-medium text-amber-600">
                            {reviewCount} to review
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 140 }}>
                      {req.budgetMin || req.budgetMax ? (
                        <span className="font-mono text-sm text-muted-foreground">
                          {req.budgetMin && req.budgetMax
                            ? `$${req.budgetMin}–$${req.budgetMax}`
                            : req.budgetMin
                              ? `$${req.budgetMin}+`
                              : `Up to $${req.budgetMax}`}
                          <span className="text-[10px]">/{req.budgetType === "monthly" ? "mo" : req.budgetType === "annual" ? "yr" : "hr"}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 100 }}>
                      {req.hiringCountries?.length > 0 ? (
                        <CountryFlags codes={req.hiringCountries} max={3} />
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 100 }}>
                      <span className="text-sm capitalize text-muted-foreground">
                        {req.engagementType?.replace("-", " ") ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="overflow-hidden" style={{ width: 100 }}>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(req.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-muted-foreground">
              {filteredRequirements.length} requirement{filteredRequirements.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export { RequirementsListClient };
