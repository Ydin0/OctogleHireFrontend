import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  ShieldCheck,
  Users,
} from "lucide-react";

import { fetchAdminStats, fetchApplications } from "@/lib/api/admin";
import {
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
  PIPELINE_STAGES,
} from "./_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default async function AdminOverviewPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [stats, recentResult] = await Promise.all([
    fetchAdminStats(token),
    fetchApplications(token, {
      page: 1,
      limit: 5,
      sortBy: "submittedAt",
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
      value: "-",
      hint: "Coming soon",
      icon: Building2,
    },
  ];

  const pipelineBreakdown = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: byStatus[stage] ?? 0,
  }));

  const maxPipelineCount = Math.max(
    ...pipelineBreakdown.map((p) => p.count),
    1
  );

  const recentApplicants = recentResult?.applications ?? [];

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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applicant submissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplicants.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No applications yet.
              </p>
            )}
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center gap-3">
                <Avatar size="sm">
                  {applicant.profilePhotoPath && (
                    <AvatarImage
                      src={applicant.profilePhotoPath}
                      alt={applicant.fullName ?? ""}
                    />
                  )}
                  <AvatarFallback>
                    {getInitials(applicant.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {applicant.fullName ?? "Unknown"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {applicant.professionalTitle ?? "-"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-[10px] ${applicationStatusBadgeClass(applicant.status as ApplicationStatus)}`}
                >
                  {applicationStatusLabel[
                    applicant.status as ApplicationStatus
                  ] ?? applicant.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
