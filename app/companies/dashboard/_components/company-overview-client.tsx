"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  ClipboardList,
  DollarSign,
  Download,
  Plus,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

import {
  requirementStatusBadgeClass,
  requirementStatusLabel,
  formatDate as formatDateAdmin,
} from "@/app/admin/dashboard/_components/dashboard-data";
import type {
  JobRequirement,
  TeamMember,
  CompanyEngagement,
  CompanyProfileSummary,
} from "@/lib/api/companies";
import { CountryFlags } from "@/lib/utils/country-flags";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OnboardingChecklist } from "./onboarding-checklist";

function countToReview(req: JobRequirement): number {
  return (req.proposedMatches ?? []).filter((m) => m.status === "accepted").length;
}

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function computeMonthlyBill(engagements: CompanyEngagement[]): number {
  return engagements
    .filter((e) => e.status === "active")
    .reduce((sum, e) => {
      const hours =
        e.engagementType === "full-time"
          ? 160
          : e.engagementType === "part-time"
            ? 80
            : 0;
      return sum + e.companyBillingRate * hours;
    }, 0);
}

const DISMISS_KEY = "octoglehire:dismiss-discover-prompt";

export function CompanyOverviewClient({
  requirements,
  team,
  engagements,
  profile,
}: {
  requirements: JobRequirement[];
  team: TeamMember[];
  engagements: CompanyEngagement[];
  profile: CompanyProfileSummary | null;
}) {
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  useEffect(() => {
    setBannerDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const showBanner = requirements.length === 0 && !bannerDismissed;

  const activeEngagements = engagements.filter((e) => e.status === "active");
  const predictedBill = computeMonthlyBill(engagements);
  const totalToReview = requirements.reduce((sum, r) => sum + countToReview(r), 0);
  const openPositions = requirements
    .filter((r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled")
    .reduce((sum, r) => sum + r.developersNeeded, 0);

  const reqsWithReviews = requirements
    .map((r) => ({ req: r, reviewCount: countToReview(r) }))
    .filter((r) => r.reviewCount > 0)
    .sort((a, b) => b.reviewCount - a.reviewCount);

  const recentRequirements = [...requirements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const topActiveEngagements = activeEngagements.slice(0, 3);

  const kpis = [
    {
      label: "Active Engagements",
      value: activeEngagements.length.toString(),
      hint: "Developers currently working for you",
      icon: Briefcase,
      highlight: false,
    },
    {
      label: "Predicted Monthly Bill",
      value: formatCurrency(predictedBill),
      hint: "Based on engagement hours",
      icon: DollarSign,
      highlight: false,
      mono: true,
    },
    {
      label: "To Review",
      value: totalToReview.toString(),
      hint: "Developers awaiting your decision",
      icon: Bell,
      highlight: totalToReview > 0,
    },
    {
      label: "Open Positions",
      value: openPositions.toString(),
      hint: "Developers needed across open requirements",
      icon: Users,
      highlight: false,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Operations Overview</h1>
          <p className="text-sm text-muted-foreground">
            Track engagements, review matches, and manage requirements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/companies/dashboard/requirements/new">
              <Plus className="size-4" />
              Post a Requirement
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setComingSoonOpen(true)}
          >
            <Search className="size-4" />
            Browse Talent
          </Button>
        </div>
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist
        profile={profile}
        requirements={requirements}
        engagements={engagements}
      />

      {/* Onboarding: Discover Jobs Banner */}
      {showBanner && (
        <Card className="border-foreground/10">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Download className="size-4 text-pulse" />
                <p className="text-sm font-semibold">Import your existing job listings</p>
              </div>
              <p className="text-xs text-muted-foreground">
                We can discover your open positions from LinkedIn and Indeed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  localStorage.setItem(DISMISS_KEY, "true");
                  setBannerDismissed(true);
                }}
              >
                I&apos;ll post manually
              </button>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/companies/dashboard/requirements/discover">
                  <Search className="size-3.5" />
                  Discover Jobs
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}>
                  <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className={`text-lg font-semibold ${kpi.mono ? "font-mono" : ""} ${kpi.highlight ? "text-amber-600" : ""}`}>{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Active Team */}
      {topActiveEngagements.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Active Team</CardTitle>
              <CardDescription>Developers currently engaged with your company.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href="/companies/dashboard/engagements">
                View All
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {topActiveEngagements.map((eng) => (
              <div
                key={eng.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3"
              >
                <Link
                  href={`/companies/dashboard/developers/${eng.developerId}`}
                  className="flex items-center gap-3 min-w-0 hover:underline"
                >
                  <Avatar className="size-8 shrink-0">
                    {eng.developerAvatar && (
                      <AvatarImage src={eng.developerAvatar} alt={eng.developerName} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getInitials(eng.developerName || "D")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{eng.developerName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {eng.requirementTitle}
                    </p>
                  </div>
                </Link>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm">
                    {formatCurrency(eng.companyBillingRate)}/hr
                  </p>
                  <p className="text-xs text-muted-foreground">{eng.engagementType}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Matches to Review */}
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
          <CardContent className="space-y-2">
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

      {/* Recent Requirements */}
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
          <CardContent className="space-y-2">
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
                      {req.hiringCountries?.length > 0 && (
                        <CountryFlags codes={req.hiringCountries} max={3} />
                      )}
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
      <Dialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              Browse Talent is not available yet. We&apos;re working on it and
              will notify you when it&apos;s ready.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setComingSoonOpen(false)}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
