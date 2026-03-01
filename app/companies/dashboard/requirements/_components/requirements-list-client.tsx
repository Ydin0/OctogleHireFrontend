"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  Plus,
  Search,
  UserCheck,
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

const RequirementsListClient = () => {
  const { getToken } = useAuth();
  const [requirements, setRequirements] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Card className="overflow-hidden border-pulse/30 bg-gradient-to-br from-card via-card to-pulse/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h1 className="text-lg font-semibold">Requirements</h1>
              <p className="text-sm text-muted-foreground">
                Post development requirements and track engineer matches.
              </p>
            </div>
            <Button className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90" asChild>
              <Link href="/companies/dashboard/requirements/new">
                <Plus className="size-4" />
                Post New Requirement
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
            <CardContent>
              <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}>
                <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="space-y-4">
        {requirements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="mx-auto mb-3 size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No requirements posted yet. Click &quot;Post New Requirement&quot; to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          sorted.map((req) => {
            const matchCount = req.proposedMatches?.length ?? 0;
            const reviewCount = countToReview(req);
            const activeCount = (req.proposedMatches ?? []).filter(
              (m) => m.status === "active",
            ).length;
            const hasReviews = reviewCount > 0;

            return (
              <Link
                key={req.id}
                href={`/companies/dashboard/requirements/${req.id}`}
                className="block"
              >
                <Card className={`transition-colors hover:border-pulse/30 ${hasReviews ? "border-amber-500/35" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">{req.title}</h3>
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
                          {hasReviews && (
                            <Badge className="gap-1 border-amber-500/40 bg-amber-500/15 text-amber-700">
                              <UserCheck className="size-3" />
                              {reviewCount} to review
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {req.techStack.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {req.techStack.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{req.techStack.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>
                            {req.experienceYearsMin != null && req.experienceYearsMax != null
                              ? `${req.experienceYearsMin}-${req.experienceYearsMax} yrs`
                              : <span className="capitalize">{req.experienceLevel} level</span>}
                          </span>
                          <span className="capitalize">{req.engagementType.replace("-", " ")}</span>
                          <span>Start: {formatDate(req.startDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="size-3.5" />
                          <span className="font-mono">
                            {activeCount}/{req.developersNeeded}
                          </span>
                        </div>
                        {matchCount > 0 && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {matchCount} match{matchCount !== 1 ? "es" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
};

export { RequirementsListClient };
