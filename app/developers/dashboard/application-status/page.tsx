import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";

import { fetchDeveloperProfile } from "@/lib/api/developer";
import {
  buildDefaultTimeline,
  fetchDeveloperApplicationStatus,
} from "@/lib/developer-application";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function buildReadinessChecklist(profile: Awaited<ReturnType<typeof fetchDeveloperProfile>>) {
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

export default async function ApplicationStatusPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();

  const [applicationStatus, profile] = await Promise.all([
    fetchDeveloperApplicationStatus(token),
    fetchDeveloperProfile(token),
  ]);

  const timeline = applicationStatus?.timeline ?? buildDefaultTimeline();
  const checklist = buildReadinessChecklist(profile);

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>
            Track each stage from submission to marketplace activation.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Pipeline Timeline</CardTitle>
            <CardDescription>
              Current stage and next milestones in your onboarding flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {timeline.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full ${
                      step.state === "completed"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : step.state === "active"
                          ? "bg-pulse/15 text-pulse"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.state === "completed" ? (
                      <CheckCircle2 className="size-4" />
                    ) : step.state === "active" ? (
                      <Clock3 className="size-4" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="my-1 w-0.5 flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="pt-1 text-sm font-medium">{step.label}</p>
                  {step.state === "active" && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      We are reviewing profile details, public links, and portfolio signals.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Readiness Tasks</CardTitle>
            <CardDescription>
              Complete these to increase approval confidence.
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
      </section>
    </>
  );
}
