import { ArrowRight, CalendarCheck, FolderKanban } from "lucide-react";

import { opportunities } from "../_components/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EngagementsPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>My Engagements</CardTitle>
          <CardDescription>
            Active and past engagement workspace for client delivery.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Active Engagements
            </CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            No active client projects yet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Interview Pipeline
            </CardDescription>
            <CardTitle className="text-2xl">1</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            One opportunity pending final client review.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Client Feedback
            </CardDescription>
            <CardTitle className="text-2xl">-</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Feedback history appears after first engagement.
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Current Engagement State</CardTitle>
            <CardDescription>
              Once approved and matched, project milestones are tracked here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-pulse" />
                <p className="text-sm font-semibold">Awaiting first assignment</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep your availability and profile assets updated to accelerate
                placement into active projects.
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-4">
              <p className="text-sm font-semibold">What will appear here</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="size-3.5 text-pulse" />
                  Engagement timeline and milestones
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="size-3.5 text-pulse" />
                  Client check-ins and feedback
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="size-3.5 text-pulse" />
                  Delivery notes and extension decisions
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Opportunity Pipeline</CardTitle>
            <CardDescription>
              High-fit opportunities currently in circulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {opportunities.map((opportunity) => (
              <div key={opportunity.role} className="rounded-lg border border-border/70 p-3">
                <p className="text-sm font-semibold">{opportunity.role}</p>
                <p className="text-xs text-muted-foreground">{opportunity.company}</p>
                <p className="mt-2 text-xs text-muted-foreground">{opportunity.timezone}</p>
              </div>
            ))}
            <div className="rounded-lg border border-pulse/35 bg-pulse/10 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-4 text-pulse" />
                Pipeline auto-updates as your profile and availability change.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default EngagementsPage;
