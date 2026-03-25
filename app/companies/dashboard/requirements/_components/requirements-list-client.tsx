"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Bell,
  CheckCircle2,
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
  type RequirementStatus,
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
import { DataTable } from "@/app/admin/dashboard/_components/data-table";

function countToReview(req: JobRequirement): number {
  return (req.proposedMatches ?? []).filter((m) => m.status === "accepted")
    .length;
}

type StatusFilter = "all" | "open" | "closed" | "filled";

// ── Column definitions ──────────────────────────────────────────────────────

function getColumns(): ColumnDef<JobRequirement>[] {
  return [
    {
      accessorKey: "title",
      header: "Requirement",
      size: 280,
      cell: ({ row }) => {
        const { title, techStack } = row.original;
        const display = techStack.slice(0, 3);
        const remaining = techStack.length - 3;
        return (
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <div className="flex flex-wrap gap-1">
              {display.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-[10px] font-normal px-1.5 py-0"
                >
                  {tech}
                </Badge>
              ))}
              {remaining > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  +{remaining}
                </Badge>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "experienceLevel",
      header: "Experience",
      size: 100,
      cell: ({ getValue }) => {
        const level = getValue() as string;
        const labels: Record<string, string> = {
          junior: "Junior",
          mid: "Mid",
          senior: "Senior",
          lead: "Lead",
          principal: "Principal",
        };
        const badgeClass = (l: string) => {
          switch (l) {
            case "junior":
              return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
            case "mid":
              return "bg-blue-500/10 text-blue-600 border-blue-600/20";
            case "senior":
              return "bg-violet-500/10 text-violet-600 border-violet-600/20";
            case "lead":
              return "bg-orange-500/10 text-orange-600 border-orange-600/20";
            case "principal":
              return "bg-red-500/10 text-red-600 border-red-600/20";
            default:
              return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
          }
        };
        return (
          <Badge variant="outline" className={badgeClass(level)}>
            {labels[level] ?? level}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue() as RequirementStatus;
        return (
          <Badge
            variant="outline"
            className={requirementStatusBadgeClass(status)}
          >
            {requirementStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
      cell: ({ getValue }) => {
        const p = getValue() as string;
        return (
          <Badge variant="outline" className={priorityBadgeClass(p)}>
            {priorityLabel[p] ?? p}
          </Badge>
        );
      },
    },
    {
      id: "candidates",
      header: "Candidates",
      size: 110,
      cell: ({ row }) => {
        const req = row.original;
        const matches = req.proposedMatches ?? [];
        const activeMatchCount = matches.filter(
          (m) => m.status === "active",
        ).length;
        const reviewCount = countToReview(req);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Users className="size-3.5 text-muted-foreground" />
              {activeMatchCount}/{req.developersNeeded}
            </span>
            {reviewCount > 0 && (
              <span className="text-[10px] font-medium text-amber-600">
                {reviewCount} to review
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "budget",
      header: "Budget",
      size: 150,
      cell: ({ row }) => {
        const { budgetMin, budgetMax, budgetType } = row.original;
        if (!budgetMin && !budgetMax) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        const suffix =
          budgetType === "monthly"
            ? "/mo"
            : budgetType === "annual"
              ? "/yr"
              : "/hr";
        return (
          <span className="font-mono text-sm">
            {budgetMin && budgetMax
              ? `$${budgetMin}–$${budgetMax}`
              : budgetMin
                ? `$${budgetMin}+`
                : `Up to $${budgetMax}`}
            <span className="text-[10px] text-muted-foreground">{suffix}</span>
          </span>
        );
      },
    },
    {
      id: "countries",
      header: "Countries",
      size: 100,
      cell: ({ row }) => {
        const codes = row.original.hiringCountries;
        if (!codes?.length) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        return <CountryFlags codes={codes} max={3} />;
      },
    },
    {
      accessorKey: "engagementType",
      header: "Type",
      size: 110,
      cell: ({ getValue }) => {
        const val = getValue() as string | null;
        return (
          <span className="text-sm capitalize text-muted-foreground">
            {val?.replace("-", " ") ?? "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      size: 110,
      cell: ({ getValue }) => {
        const date = getValue() as string | null;
        if (!date) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(date)}
          </span>
        );
      },
    },
  ];
}

// ── Main component ──────────────────────────────────────────────────────────

const RequirementsListClient = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const data = await fetchCompanyRequirements(token);
      if (data) setRequirements(data);
      setLoading(false);
    };
    load();
  }, [getToken]);

  const openCount = requirements.filter((r) => r.status === "open").length;
  const matchingCount = requirements.filter(
    (r) => r.status === "matching" || r.status === "partially_filled",
  ).length;
  const filledCount = requirements.filter(
    (r) => r.status === "filled",
  ).length;
  const totalToReview = requirements.reduce(
    (sum, r) => sum + countToReview(r),
    0,
  );

  const kpis = [
    {
      label: "To Review",
      value: String(totalToReview),
      icon: Bell,
      highlight: totalToReview > 0,
    },
    { label: "Open", value: String(openCount), icon: Clock, highlight: false },
    {
      label: "Matching",
      value: String(matchingCount),
      icon: Search,
      highlight: false,
    },
    {
      label: "Filled",
      value: String(filledCount),
      icon: CheckCircle2,
      highlight: false,
    },
  ];

  const sorted = useMemo(
    () =>
      [...requirements].sort((a, b) => {
        const aReview = countToReview(a);
        const bReview = countToReview(b);
        if (aReview > 0 && bReview === 0) return -1;
        if (bReview > 0 && aReview === 0) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
    [requirements],
  );

  const closedCount = requirements.filter(
    (r) => r.status === "closed",
  ).length;
  const activeCount = requirements.filter(
    (r) =>
      r.status === "open" ||
      r.status === "matching" ||
      r.status === "partially_filled",
  ).length;

  const statusFilters: {
    label: string;
    value: StatusFilter;
    count: number;
  }[] = [
    { label: "All", value: "all", count: requirements.length },
    { label: "Active", value: "open", count: activeCount },
    { label: "Filled", value: "filled", count: filledCount },
    { label: "Closed", value: "closed", count: closedCount },
  ];

  const filteredRequirements = useMemo(() => {
    const base =
      statusFilter === "all"
        ? sorted
        : statusFilter === "open"
          ? sorted.filter(
              (r) =>
                r.status === "open" ||
                r.status === "matching" ||
                r.status === "partially_filled",
            )
          : sorted.filter((r) => r.status === statusFilter);
    return base;
  }, [sorted, statusFilter]);

  // Client-side pagination
  const total = filteredRequirements.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paginatedData = filteredRequirements.slice(
    (safePage - 1) * limit,
    safePage * limit,
  );

  const columns = useMemo(() => getColumns(), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          <Card
            key={kpi.label}
            className={
              kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}
                >
                  <kpi.icon
                    className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p
                    className={`text-lg font-semibold ${kpi.highlight ? "text-amber-600" : ""}`}
                  >
                    {kpi.value}
                  </p>
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
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
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
        <DataTable
          columns={columns}
          data={paginatedData}
          pagination={{
            page: safePage,
            limit,
            total,
            totalPages,
          }}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onRowClick={(req) =>
            router.push(`/companies/dashboard/requirements/${req.id}`)
          }
        />
      )}
    </>
  );
};

export { RequirementsListClient };
