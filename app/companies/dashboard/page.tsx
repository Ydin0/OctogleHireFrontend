"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  ClipboardList,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
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

function countToReview(req: JobRequirement): number {
  return (req.proposedMatches ?? []).filter((m) => m.status === "accepted").length;
}

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

  const totalToReview = reqs.reduce((sum, r) => sum + countToReview(r), 0);

  const reqsWithReviews = reqs
    .map((r) => ({ req: r, reviewCount: countToReview(r) }))
    .filter((r) => r.reviewCount > 0)
    .sort((a, b) => b.reviewCount - a.reviewCount);

  const recentRequirements = [...reqs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const kpis = [
    {
      label: "To Review",
      value: totalToReview.toString(),
      hint: "Developers awaiting your decision",
      icon: Bell,
      highlight: totalToReview > 0,
    },
    {
      label: "Requirements",
      value: reqs.length.toString(),
      hint: "Total job requirements posted",
      icon: ClipboardList,
      highlight: false,
    },
    {
      label: "Open Positions",
      value: openPositions.toString(),
      hint: "Developers needed across open requirements",
      icon: Briefcase,
      highlight: false,
    },
    {
      label: "Matched",
      value: matchedCount.toString(),
      hint: "Accepted or active developer matches",
      icon: UserCheck,
      highlight: false,
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
          {/* Action-needed banner */}
          {totalToReview > 0 && (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                  <Bell className="size-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {totalToReview} developer{totalToReview !== 1 ? "s" : ""} awaiting your review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Developers have expressed interest in your roles. Review their profiles and confirm hire to start engagements.
                  </p>
                </div>
                <Button size="sm" className="shrink-0 gap-1.5 bg-amber-600 text-white hover:bg-amber-700" asChild>
                  <Link href="/companies/dashboard/requirements">
                    Review Now
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* KPIs */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <Card
                key={kpi.label}
                className={kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}
              >
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
                    {kpi.label}
                  </CardDescription>
                  <CardTitle className={`text-2xl ${kpi.highlight ? "text-amber-600" : ""}`}>
                    {kpi.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{kpi.hint}</span>
                  <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}>
                    <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Requirements needing review */}
          {reqsWithReviews.length > 0 && (
            <Card className="border-amber-500/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15">
                    <UserCheck className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Matches to Review</CardTitle>
                    <CardDescription>Developers who accepted — confirm hire to start engagement.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {reqsWithReviews.map(({ req, reviewCount }) => (
                  <Link
                    key={req.id}
                    href={`/companies/dashboard/requirements/${req.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 transition-colors hover:border-amber-500/40"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="size-3.5 text-amber-600" />
                        <p className="truncate text-sm font-semibold">{req.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {req.techStack.slice(0, 3).join(", ")}
                        {req.techStack.length > 3 ? ` +${req.techStack.length - 3}` : ""}
                      </p>
                    </div>
                    <Badge className="shrink-0 border-amber-500/40 bg-amber-500/15 text-amber-700">
                      {reviewCount} to review
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent requirements */}
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
                  const reviewCount = countToReview(req);
                  const activeCount = (req.proposedMatches ?? []).filter(
                    (m) => m.status === "active",
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
                            {activeCount}/{req.developersNeeded}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reviewCount > 0 && (
                          <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-700">
                            {reviewCount} to review
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={requirementStatusBadgeClass(req.status)}
                        >
                          {requirementStatusLabel[req.status]}
                        </Badge>
                      </div>
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
