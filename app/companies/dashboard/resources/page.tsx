import { CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

import { teamMembers } from "../_components/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ResourcesPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Capacity and upcoming resource events across the offshore team.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Capacity by Developer</CardTitle>
            <CardDescription>
              Weekly utilization and load monitoring for assigned contributors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="rounded-lg border border-border/70 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <span className="text-sm font-medium">{member.utilization}% booked</span>
                </div>
                <Progress value={member.utilization} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Renewals, onboarding, and utilization warnings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border/70 p-4">
              <p className="text-sm font-semibold">Contract Renewal</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sofia Patel renewal decision due in 5 days.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" />
                Feb 19, 2026
              </div>
            </div>

            <div className="rounded-lg border border-border/70 p-4">
              <p className="text-sm font-semibold">New Squad Start</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Payments team onboarding scheduled for next Monday.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5" />
                Ready to launch
              </div>
            </div>

            <div className="rounded-lg border border-border/70 p-4">
              <p className="text-sm font-semibold">Availability Risk</p>
              <p className="mt-1 text-sm text-muted-foreground">
                One backend contractor at 98% sustained allocation.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />
                Capacity adjustment suggested
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ResourcesPage;
