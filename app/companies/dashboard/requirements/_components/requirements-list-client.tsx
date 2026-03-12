"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
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
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-center">Candidates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.map((req) => {
                  const matches = req.proposedMatches ?? [];
                  const reviewCount = countToReview(req);
                  const activeCount = matches.filter((m) => m.status === "active").length;

                  return (
                    <TableRow key={req.id} className="group">
                      <TableCell>
                        <Link
                          href={`/companies/dashboard/requirements/${req.id}`}
                          className="block space-y-1"
                        >
                          <p className="text-sm font-medium group-hover:underline">
                            {req.title}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {req.techStack.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                                {tech}
                              </Badge>
                            ))}
                            {req.techStack.length > 3 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{req.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={requirementStatusBadgeClass(req.status)}
                        >
                          {requirementStatusLabel[req.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={priorityBadgeClass(req.priority)}
                        >
                          {priorityLabel[req.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-sm font-medium">
                            <Users className="mr-1 inline size-3 text-muted-foreground" />
                            {activeCount}/{req.developersNeeded}
                          </span>
                          {reviewCount > 0 && (
                            <span className="text-[10px] font-medium text-amber-600">
                              {reviewCount} to review
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize text-muted-foreground">
                          {req.engagementType?.replace("-", " ") ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(req.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/companies/dashboard/requirements/${req.id}`}>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export { RequirementsListClient };
