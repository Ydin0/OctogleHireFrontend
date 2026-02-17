import { Clock3, FileText, Sparkles } from "lucide-react";

import { opportunities, readinessChecklist } from "./_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const OverviewPage = () => {
  const completedChecklist = readinessChecklist.filter((item) => item.done).length;

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
            <CardTitle className="text-2xl">Under Review</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Verification of links and experience is active.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Checklist Progress
            </CardDescription>
            <CardTitle className="text-2xl">
              {completedChecklist}/{readinessChecklist.length}
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
            <CardTitle className="text-2xl">{opportunities.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Roles matched to your profile and timezone overlap.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Expected Review Time
            </CardDescription>
            <CardTitle className="text-2xl">48h</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Average review window after complete submission.
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
            {readinessChecklist.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center gap-2">
                  {item.done ? (
                    <FileText className="size-4 text-emerald-600" />
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
            {opportunities.map((opportunity) => (
              <div key={opportunity.role} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{opportunity.role}</p>
                    <p className="text-xs text-muted-foreground">{opportunity.company}</p>
                  </div>
                  <Badge variant="outline" className="border-pulse/35 bg-pulse/10 text-pulse">
                    {opportunity.match}%
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{opportunity.timezone}</p>
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
};

export default OverviewPage;
