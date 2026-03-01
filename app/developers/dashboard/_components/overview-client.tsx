"use client";

import { CheckCircle2, Clock3, FileText, Sparkles } from "lucide-react";

import type { DeveloperProfile, DeveloperOffer, DeveloperOpportunity } from "@/lib/api/developer";
import type { DeveloperApplicationStatusResponse } from "@/lib/developer-application";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  hr_communication_round: "HR Review",
  ai_technical_examination: "Tech Exam",
  tech_lead_human_interview: "Tech Interview",
  background_previous_company_checks: "Background Checks",
  offer_extended: "Offer Extended",
  offer_declined: "Offer Declined",
  approved: "Approved",
  rejected: "Rejected",
};

interface ReadinessItem {
  title: string;
  done: boolean;
  hint: string;
}

function buildReadinessChecklist(profile: DeveloperProfile | null): ReadinessItem[] {
  if (!profile) return [];

  return [
    {
      title: "GitHub Connected",
      done: !!profile.githubUrl,
      hint: "Link your GitHub to enable repository analysis.",
    },
    {
      title: "LinkedIn Connected",
      done: !!profile.linkedinUrl,
      hint: "Add your LinkedIn profile for professional verification.",
    },
    {
      title: "Portfolio Added",
      done: !!profile.portfolioUrl,
      hint: "Showcase your work with a portfolio link.",
    },
    {
      title: "Availability Confirmed",
      done: !!profile.availability,
      hint: "Set your availability to help with matching.",
    },
    {
      title: "Profile Photo",
      done: !!profile.profilePhotoUrl,
      hint: "Add a profile photo to build trust with companies.",
    },
    {
      title: "Bio Complete",
      done: !!(profile.aboutLong || profile.bio),
      hint: "Write a summary to introduce yourself to potential clients.",
    },
    {
      title: "Skills Listed",
      done: (profile.primaryStack?.length ?? 0) > 0,
      hint: "Add your primary skills for accurate matching.",
    },
    {
      title: "Work Experience Added",
      done: Array.isArray(profile.workExperience) && profile.workExperience.length > 0,
      hint: "Add past work experience to strengthen your profile.",
    },
  ];
}

export function OverviewClient({
  profile,
  offers,
  opportunities,
  applicationStatus,
}: {
  profile: DeveloperProfile | null;
  offers: DeveloperOffer[];
  opportunities: DeveloperOpportunity[];
  applicationStatus: DeveloperApplicationStatusResponse | null;
}) {
  const checklist = buildReadinessChecklist(profile);
  const completedCount = checklist.filter((item) => item.done).length;
  const proposedOpportunities = opportunities.filter((o) => o.status === "proposed");
  const pendingOffers = offers.filter((o) => o.status === "pending");

  const statusLabel = applicationStatus?.status
    ? STATUS_LABELS[applicationStatus.status] ?? applicationStatus.status
    : "Unknown";

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A snapshot of your onboarding and match readiness.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Application Stage
            </CardDescription>
            <CardTitle className="text-2xl">{statusLabel}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Current stage in the onboarding pipeline.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Checklist Progress
            </CardDescription>
            <CardTitle className="text-2xl">
              {completedCount}/{checklist.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Complete remaining trust signals to improve matching speed.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Suggested Opportunities
            </CardDescription>
            <CardTitle className="text-2xl">{proposedOpportunities.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Roles matched to your profile by the team.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Active Offers
            </CardDescription>
            <CardTitle className="text-2xl">{pendingOffers.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Offers awaiting your response.
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Priority Next Steps</CardTitle>
            <CardDescription>
              Highest-impact actions for profile quality and approvals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <Clock3 className="size-4 text-amber-600" />
                  )}
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Match Snapshot</CardTitle>
            <CardDescription>
              Roles currently aligned to your technical profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposedOpportunities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No proposed matches yet. Complete your profile to get matched.
              </p>
            )}
            {proposedOpportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{opp.requirementTitle}</p>
                    <p className="text-xs text-muted-foreground">{opp.companyName}</p>
                  </div>
                  <Badge variant="outline" className="border-pulse/35 bg-pulse/10 text-pulse capitalize">
                    {opp.engagementType}
                  </Badge>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-pulse/35 bg-pulse/10 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-pulse" />
                Opportunity feed refreshes after profile updates.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Updates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Follow application checkpoints and review notes.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Profile Quality</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Maintain strong portfolio, skills proof, and communication assets.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Engagement Readiness</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep availability and preferred engagement settings updated.
          </CardContent>
        </Card>
      </section>
    </>
  );
}
