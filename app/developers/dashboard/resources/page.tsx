import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Briefcase,
  FileText,
  LifeBuoy,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { fetchDeveloperProfile } from "@/lib/api/developer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ResourcesPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();
  const profile = await fetchDeveloperProfile(token);

  const publicProfileHref = profile?.slug
    ? `/developers/${profile.slug}`
    : "/developers";

  const resources = [
    {
      title: "Application Status",
      description: "View detailed onboarding and review checkpoints.",
      href: "/apply/status",
      icon: FileText,
      cta: "Open Status",
    },
    {
      title: "Update Application",
      description: "Edit profile details, links, and availability preferences.",
      href: "/apply",
      icon: UserCircle2,
      cta: "Edit Application",
    },
    {
      title: "Public Profile",
      description: "See how companies view your marketplace profile.",
      href: publicProfileHref,
      icon: ShieldCheck,
      cta: "View Profile",
    },
    {
      title: "Marketplace",
      description: "Browse talent pages and benchmark profile positioning.",
      href: "/developers",
      icon: Briefcase,
      cta: "Open Marketplace",
    },
    {
      title: "Developer Guides",
      description: "Access profile optimization and interview readiness resources.",
      href: "#",
      icon: BookOpen,
      cta: "Open Guides",
    },
    {
      title: "Support",
      description: "Contact the OctogleHire team for onboarding help.",
      href: "#",
      icon: LifeBuoy,
      cta: "Get Support",
    },
  ] as const;

  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Quick access to tools, profile controls, and support channels.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <resource.icon className="size-4 text-pulse" />
                {resource.title}
              </CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={resource.href}>{resource.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
