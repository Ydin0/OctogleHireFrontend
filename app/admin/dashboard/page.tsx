import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Handshake,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";

import { fetchAdminStats, fetchAdminRequirements } from "@/lib/api/admin";
import {
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
  PIPELINE_STAGES,
} from "./_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const priorityClass: Record<string, string> = {
  urgent: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  medium: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  low: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

export default async function AdminOverviewPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [stats, openResult] = await Promise.all([
    fetchAdminStats(token),
    fetchAdminRequirements(token, {
      status: "open,matching",
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
  ]);

  const total = stats?.total ?? 0;
  const byStatus = stats?.byStatus ?? {};
  const liveCount = stats?.liveCount ?? 0;

  const pendingReview = Object.entries(byStatus)
    .filter(
      ([s]) => s !== "approved" && s !== "rejected" && s !== "draft"
    )
    .reduce((sum, [, count]) => sum + count, 0);

  const approvedCount = byStatus["approved"] ?? 0;

  const kpis = [
    {
      label: "Total Applicants",
      value: String(total),
      hint: `${pendingReview} currently in pipeline`,
      icon: Users,
    },
    {
      label: "Pending Review",
      value: String(pendingReview),
      hint: "In active pipeline stages",
      icon: ClipboardList,
    },
    {
      label: "Approved",
      value: String(approvedCount),
      hint: `${liveCount} are live on marketplace`,
      icon: CheckCircle2,
    },
    {
      label: "Live on Marketplace",
      value: String(liveCount),
      hint: "Visible to companies",
      icon: Eye,
    },
    {
      label: "Companies",
      value: String(stats?.companyCount ?? 0),
      hint: `${stats?.enquiryCount ?? 0} new enquiries`,
      icon: Building2,
    },
    {
      label: "Agencies",
      value: String(stats?.agencyCount ?? 0),
      hint: "Registered agencies",
      icon: Landmark,
    },
    {
      label: "Active Requirements",
      value: String(stats?.activeRequirementCount ?? 0),
      hint: "Open or matching",
      icon: FileText,
    },
    {
      label: "Active Engagements",
      value: String(stats?.engagementCount ?? 0),
      hint: "Currently active",
      icon: Handshake,
    },
  ];

  const pipelineBreakdown = [...PIPELINE_STAGES, "rejected" as const].map((stage) => ({
    stage,
    count: byStatus[stage] ?? 0,
  }));

  const maxPipelineCount = Math.max(
    ...pipelineBreakdown.map((p) => p.count),
    1
  );

  const openRequirements = openResult?.requirements ?? [];

  return (
    <>
      <Card className="overflow-hidden border-pulse/30">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="gap-1.5 border-pulse/40 bg-pulse/10 text-pulse"
              >
                <ShieldCheck className="size-3.5" />
                Admin Workspace
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Admin Overview
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Manage developer applications, review pipeline progress, and
                track company enquiries from a single view.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/admin/dashboard/applicants">
                  View Applicants
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/admin/dashboard/companies">
                  View Companies
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardDescription className="font-mono text-xs uppercase tracking-[0.08em]">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {kpi.hint}
              </span>
              <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                <kpi.icon className="size-4 text-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Pipeline Breakdown</CardTitle>
            <CardDescription>
              Applicant count by pipeline stage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineBreakdown.map(({ stage, count }) => (
              <div key={stage}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {applicationStatusLabel[stage]}
                  </span>
                  <span className="font-mono font-medium">{count}</span>
                </div>
                <Progress
                  value={(count / maxPipelineCount) * 100}
                  className="bg-muted"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-pulse/25 xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Requirements</CardTitle>
                <CardDescription>Requirements needing attention.</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard/requirements">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {openRequirements.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No open requirements.
              </p>
            )}
            {openRequirements.map((req) => (
              <Link
                key={req.id}
                href={`/admin/dashboard/requirements/${req.id}`}
                className="flex items-start gap-3 rounded-md border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-accent/50"
              >
                {req.companyLogoUrl ? (
                  <img
                    src={req.companyLogoUrl}
                    alt=""
                    className="mt-0.5 size-8 shrink-0 rounded-md object-contain"
                  />
                ) : (
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {(req.companyName ?? "?")[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{req.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {req.companyName ?? "Unknown"}
                  </p>
                  {req.techStack.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {req.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {req.techStack.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{req.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${priorityClass[req.priority] ?? ""}`}
                  >
                    {req.priority}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {req.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
