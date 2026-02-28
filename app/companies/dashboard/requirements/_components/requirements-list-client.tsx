"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const kpis = [
    { label: "Total", value: String(requirements.length), icon: ClipboardList },
    { label: "Open", value: String(openCount), icon: Clock },
    { label: "Matching", value: String(matchingCount), icon: Search },
    { label: "Filled", value: String(filledCount), icon: CheckCircle2 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex size-8 items-center justify-center rounded-full bg-pulse/10">
                <kpi.icon className="size-4 text-pulse" />
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
          requirements.map((req) => {
            const matchCount = req.proposedMatches?.length ?? 0;
            const acceptedCount =
              req.proposedMatches?.filter(
                (m) => m.status === "accepted" || m.status === "active",
              ).length ?? 0;

            return (
              <Link
                key={req.id}
                href={`/companies/dashboard/requirements/${req.id}`}
                className="block"
              >
                <Card className="transition-colors hover:border-pulse/30">
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
                          <span className="capitalize">{req.experienceLevel} level</span>
                          <span className="capitalize">{req.engagementType.replace("-", " ")}</span>
                          <span>Start: {formatDate(req.startDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="size-3.5" />
                          <span className="font-mono">
                            {acceptedCount}/{req.developersNeeded}
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
