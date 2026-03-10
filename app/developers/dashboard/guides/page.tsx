import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Users, DollarSign, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GuidesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const guides = [
    {
      title: "Profile Optimization",
      icon: Star,
      badge: "Visibility",
      description:
        "Improve your marketplace visibility and attract the right opportunities.",
      tips: [
        "Write a concise headline that highlights your primary expertise and years of experience.",
        "List specific technologies and frameworks rather than broad categories.",
        "Include links to live projects, open-source contributions, or a portfolio site.",
        "Upload a professional avatar -- profiles with photos receive significantly more views.",
        "Keep your availability status current so companies know when you can start.",
      ],
    },
    {
      title: "Interview Preparation",
      icon: Users,
      badge: "Matching",
      description:
        "Understand how OctogleHire connects you with companies and what to expect.",
      tips: [
        "After a company expresses interest, you will receive a structured brief outlining the role and expectations.",
        "Prepare a short walkthrough of a recent project that demonstrates your problem-solving approach.",
        "Be ready to discuss your preferred working style: async-first, pair programming, meeting cadence, etc.",
        "Ask about team composition, deployment practices, and code review culture during your interview.",
        "Follow up within 24 hours with any clarifications or additional context the company requested.",
      ],
    },
    {
      title: "Engagement Best Practices",
      icon: Sparkles,
      badge: "Placements",
      description:
        "Tips for building strong client relationships and successful placements.",
      tips: [
        "Establish clear communication channels and response-time expectations on day one.",
        "Send brief daily or weekly progress updates even when not explicitly asked.",
        "Document decisions and technical trade-offs in writing for future reference.",
        "Flag blockers early rather than waiting for a scheduled check-in.",
        "Treat every engagement as a long-term relationship -- repeat placements are common on OctogleHire.",
      ],
    },
    {
      title: "Rate Setting Guide",
      icon: DollarSign,
      badge: "Rates",
      description:
        "Set competitive rates that reflect your experience and market positioning.",
      tips: [
        "Research market rates for your technology stack and experience level before setting a price.",
        "Factor in the value you deliver, not just hours worked -- outcome-based pricing can command higher rates.",
        "Consider offering a modest introductory rate for your first engagement to build reviews on the platform.",
        "Be transparent about what is included in your rate: code review, meetings, documentation, etc.",
        "Revisit your rate every quarter as you gain more experience and positive placement history.",
      ],
    },
  ] as const;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="size-8">
              <Link href="/developers/dashboard/resources">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <CardTitle>Developer Guides</CardTitle>
              <CardDescription>
                Practical advice for optimizing your profile, preparing for
                interviews, and succeeding on the platform.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {guides.map((guide) => (
          <Card key={guide.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <guide.icon className="size-4 text-pulse" />
                  {guide.title}
                </CardTitle>
                <Badge variant="secondary">
                  <span className="text-[10px] uppercase tracking-wider">
                    {guide.badge}
                  </span>
                </Badge>
              </div>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {guide.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
