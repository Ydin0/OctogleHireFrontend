import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { fetchAgencyRequirementDetail } from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import { MarkdownDisplay } from "@/components/markdown-display";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RequirementActions } from "./_components/requirement-actions";

const priorityBadge: Record<string, string> = {
  low: "border-zinc-600/20 bg-zinc-500/10 text-zinc-600",
  medium: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  high: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  urgent: "border-red-600/20 bg-red-500/10 text-red-600",
};

const formatBudget = (cents: number | null) => {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

interface RequirementDetailPageProps {
  params: Promise<{ reqId: string }>;
}

export default async function AgencyRequirementDetailPage({
  params,
}: RequirementDetailPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const { reqId } = await params;

  const requirement = await fetchAgencyRequirementDetail(token, reqId);

  if (!requirement) {
    notFound();
  }

  return (
    <>
      <Link
        href="/agencies/dashboard/requirements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Marketplace
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">{requirement.title}</CardTitle>
              {requirement.companyName && (
                <p className="text-sm text-muted-foreground">
                  {requirement.companyName}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className={
                priorityBadge[requirement.priority] ?? priorityBadge.medium
              }
            >
              {requirement.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {requirement.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Experience
              </p>
              <p className="font-medium capitalize">
                {requirement.experienceLevel}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Type
              </p>
              <p className="font-medium capitalize">
                {requirement.engagementType}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Developers Needed
              </p>
              <p className="font-mono font-medium">
                {requirement.developersNeeded}
              </p>
            </div>
            {(requirement.budgetMinCents || requirement.budgetMaxCents) && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Budget Range
                </p>
                <p className="font-mono font-medium">
                  {formatBudget(requirement.budgetMinCents)} –{" "}
                  {formatBudget(requirement.budgetMaxCents)}
                </p>
              </div>
            )}
            {requirement.startDate && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Start Date
                </p>
                <p className="font-medium">{requirement.startDate}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Timezone
              </p>
              <p className="font-medium capitalize">
                {requirement.timezonePreference}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </p>
            <MarkdownDisplay content={requirement.description} />
          </div>
        </CardContent>
      </Card>

      <RequirementActions requirement={requirement} />
    </>
  );
}
