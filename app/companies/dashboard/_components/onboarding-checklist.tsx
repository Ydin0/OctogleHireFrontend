"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, X } from "lucide-react";

import type { CompanyProfileSummary, JobRequirement, CompanyEngagement } from "@/lib/api/companies";
import type { ProposedMatch } from "@/lib/api/companies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DISMISS_KEY = "octoglehire:dismiss-onboarding";

interface OnboardingChecklistProps {
  profile: CompanyProfileSummary | null;
  requirements: JobRequirement[];
  engagements: CompanyEngagement[];
}

interface Step {
  label: string;
  description: string;
  href: string;
  complete: boolean;
}

export function OnboardingChecklist({
  profile,
  requirements,
  engagements,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const allMatches: ProposedMatch[] = requirements.flatMap(
    (r) => r.proposedMatches ?? [],
  );

  const steps: Step[] = [
    {
      label: "Complete company profile",
      description: "Add your website, logo, and location.",
      href: "/companies/dashboard/settings",
      complete: !!(profile?.website && profile?.logoUrl && profile?.location),
    },
    {
      label: "Post first requirement",
      description: "Tell us what kind of developer you need.",
      href: "/companies/dashboard/requirements/new",
      complete: requirements.length > 0,
    },
    {
      label: "Review first match",
      description: "Accept or decline a proposed candidate.",
      href: "/companies/dashboard/requirements",
      complete: allMatches.some((m) => m.status !== "proposed"),
    },
    {
      label: "Start first engagement",
      description: "Begin working with a developer.",
      href: "/companies/dashboard/engagements",
      complete: engagements.some((e) => e.status === "active" || e.status === "ended"),
    },
  ];

  const completedCount = steps.filter((s) => s.complete).length;
  const allComplete = completedCount === steps.length;

  if (dismissed || allComplete) return null;

  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">Getting Started</CardTitle>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{steps.length} complete
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "true");
            setDismissed(true);
          }}
        >
          <X className="size-3.5" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-1.5" />
        <div className="space-y-1">
          {steps.map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                step.complete
                  ? "text-muted-foreground"
                  : "hover:bg-muted/50"
              }`}
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                  step.complete
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border"
                }`}
              >
                {step.complete && <Check className="size-3" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={step.complete ? "line-through" : "font-medium"}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {!step.complete && (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
