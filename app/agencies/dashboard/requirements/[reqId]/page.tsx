import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar } from "lucide-react";

import { fetchAgencyRequirementDetail } from "@/lib/api/agencies";
import { CountryFlags } from "@/lib/utils/country-flags";
import { MarkdownDisplay } from "@/components/markdown-display";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { RequirementActions } from "./_components/requirement-actions";

const priorityBadgeClass = (p: string) => {
  switch (p) {
    case "urgent":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "high":
      return "bg-orange-500/8 text-orange-500 border-orange-500/15";
    case "medium":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

const priorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusBadgeClass = (s: string) => {
  switch (s) {
    case "open":
      return "bg-sky-500/8 text-sky-500 border-sky-500/15";
    case "filled":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "closed":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    default:
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
  }
};

const formatBudget = (cents: number | null) => {
  if (cents == null) return "?";
  return `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/agencies/dashboard/requirements"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Requirements
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
              {requirement.companyLogoUrl ? (
                <Image
                  src={requirement.companyLogoUrl}
                  alt={requirement.companyName ?? ""}
                  width={40}
                  height={40}
                  className="size-10 object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">{requirement.title}</h1>
              <p className="text-sm text-muted-foreground">
                {requirement.companyName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status badges ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={statusBadgeClass(requirement.status)}>
          {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
        </Badge>
        <Badge variant="outline" className={priorityBadgeClass(requirement.priority)}>
          {priorityLabel[requirement.priority] ?? requirement.priority}
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto">
          <Calendar className="inline mr-1 size-3" />
          Created {formatDate(requirement.createdAt)}
        </span>
      </div>

      <Separator />

      {/* ── Pitches & Bidding (TOP — most important action) ────────── */}
      <RequirementActions requirement={requirement} />

      {/* ── Description + Details (two-column like admin) ──────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              <MarkdownDisplay content={requirement.description} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Experience</dt>
                  <dd className="capitalize">{requirement.experienceLevel}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Engagement Type</dt>
                  <dd className="capitalize">
                    {requirement.engagementType?.replace(/-/g, " ") ?? "-"}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Developers Needed</dt>
                  <dd className="font-mono">{requirement.developersNeeded}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Budget</dt>
                  <dd className="font-mono">
                    {requirement.budgetMinCents || requirement.budgetMaxCents
                      ? `${formatBudget(requirement.budgetMinCents)} – ${formatBudget(requirement.budgetMaxCents)}`
                      : "Flexible"}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Timezone</dt>
                  <dd className="capitalize">
                    {requirement.timezonePreference || "Any"}
                  </dd>
                </div>
                {requirement.startDate && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Start Date</dt>
                      <dd>{formatDate(requirement.startDate)}</dd>
                    </div>
                  </>
                )}
                {requirement.hiringCountries?.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Hiring Countries</dt>
                      <dd>
                        <CountryFlags codes={requirement.hiringCountries} />
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {requirement.techStack.length > 0 ? (
                  requirement.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No tech stack specified
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
