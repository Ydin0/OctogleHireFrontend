"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import {
  requirementStatusBadgeClass,
  requirementStatusLabel,
  formatDate as formatDateAdmin,
} from "@/app/admin/dashboard/_components/dashboard-data";
import {
  fetchCompanyRequirements,
  fetchCompanyTeam,
  type JobRequirement,
  type TeamMember,
} from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CompanyOverviewPage = () => {
  const { getToken } = useAuth();
  const [requirements, setRequirements] = useState<JobRequirement[] | null>(null);
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const [reqs, members] = await Promise.all([
        fetchCompanyRequirements(token),
        fetchCompanyTeam(token),
      ]);
      if (!cancelled) {
        setRequirements(reqs);
        setTeam(members);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  const reqs = requirements ?? [];
  const teamMembers = team ?? [];

  const openPositions = reqs
    .filter((r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled")
    .reduce((sum, r) => sum + r.developersNeeded, 0);

  const matchedCount = reqs.reduce((sum, r) => {
    const accepted = (r.proposedMatches ?? []).filter(
      (m) => m.status === "accepted" || m.status === "active",
    ).length;
    return sum + accepted;
  }, 0);

  const recentRequirements = [...reqs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const kpis = [
    {
      label: "Requirements",
      value: reqs.length.toString(),
      hint: "Total job requirements posted",
      icon: ClipboardList,
    },
    {
      label: "Open Positions",
      value: openPositions.toString(),
      hint: "Developers needed across open requirements",
      icon: Briefcase,
    },
    {
      label: "Team Members",
      value: teamMembers.length.toString(),
      hint: "People in your company workspace",
      icon: Users,
    },
    {
      label: "Matched",
      value: matchedCount.toString(),
      hint: "Accepted or active developer matches",
      icon: UserCheck,
    },
  ];

  return (
    <>
      <Card className="overflow-hidden border-pulse/30 bg-gradient-to-br from-card via-card to-pulse/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="gap-1.5 border-pulse/40 bg-pulse/10 text-pulse">
                <ShieldCheck className="size-3.5" />
                Company Workspace
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Operations Overview
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Manage your development requirements, review proposed matches,
                and track your offshore team from a single dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/companies/dashboard/requirements/new">
                  <Plus className="size-4" />
                  Post a Requirement
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/marketplace">
                  <Search className="size-4" />
                  Browse Talent
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
                    {kpi.label}
                  </CardDescription>
                  <CardTitle className="text-2xl">{kpi.value}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{kpi.hint}</span>
                  <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                    <kpi.icon className="size-4 text-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {recentRequirements.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Requirements</CardTitle>
                  <CardDescription>Latest posted development requirements.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <Link href="/companies/dashboard/requirements">
                    View All
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRequirements.map((req) => {
                  const acceptedCount = (req.proposedMatches ?? []).filter(
                    (m) => m.status === "accepted" || m.status === "active",
                  ).length;

                  return (
                    <Link
                      key={req.id}
                      href={`/companies/dashboard/requirements/${req.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:border-pulse/30"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="size-3.5 text-pulse" />
                          <p className="truncate text-sm font-semibold">{req.title}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDateAdmin(req.createdAt)}</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {acceptedCount}/{req.developersNeeded}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={requirementStatusBadgeClass(req.status)}
                      >
                        {requirementStatusLabel[req.status]}
                      </Badge>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default CompanyOverviewPage;
