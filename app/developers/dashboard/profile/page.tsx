import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, UserCircle2 } from "lucide-react";

import { fetchDeveloperProfile, fetchDeveloperOpportunities } from "@/lib/api/developer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();

  const [profile, opportunities] = await Promise.all([
    fetchDeveloperProfile(token),
    fetchDeveloperOpportunities(token),
  ]);

  const proposedMatches = (opportunities ?? []).filter((o) => o.status === "proposed");

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Manage profile details used for review and company matching.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Core information currently visible in your candidate profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Professional Title</p>
              <p className="text-sm text-muted-foreground">
                {profile?.professionalTitle ?? "Not set"}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold">Primary Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(profile?.primaryStack ?? []).length > 0 ? (
                  profile!.primaryStack!.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed yet.</p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold">Profile Summary</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.aboutLong || profile?.bio || "No summary added yet."}
              </p>
            </div>

            <Button asChild className="mt-2 bg-pulse text-pulse-foreground hover:bg-pulse/90">
              <Link href="/developers/dashboard/profile/edit">
                <UserCircle2 className="size-4" />
                Update public profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Opportunity Alignment</CardTitle>
            <CardDescription>
              Current roles best matched to your profile strengths.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposedMatches.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No proposed matches yet. Keep your profile updated.
              </p>
            )}
            {proposedMatches.slice(0, 5).map((opp) => (
              <div key={opp.id} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{opp.requirementTitle}</p>
                    <p className="text-xs text-muted-foreground">{opp.companyName}</p>
                  </div>
                  <Badge variant="outline" className="border-pulse/35 bg-pulse/10 font-mono text-pulse">
                    ${opp.proposedHourlyRate}/hr
                  </Badge>
                </div>
                {opp.techStack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {opp.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="rounded-lg border border-pulse/35 bg-pulse/10 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-pulse" />
                Keep this profile updated to maximize interview conversion.
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
