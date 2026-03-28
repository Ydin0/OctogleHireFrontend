"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import type { CompanyEngagement, OnboardingChecklistItem } from "@/lib/api/companies";
import { fetchEngagementOnboarding } from "@/lib/api/companies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OnboardingProgressWidgetProps {
  engagements: CompanyEngagement[];
}

interface EngagementProgress {
  id: string;
  developerName: string;
  completed: number;
  total: number;
}

function OnboardingProgressWidget({ engagements }: OnboardingProgressWidgetProps) {
  const { getToken } = useAuth();
  const [progressData, setProgressData] = useState<EngagementProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const activeEngagements = engagements.filter((e) => e.status === "active");

  useEffect(() => {
    if (activeEngagements.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAll() {
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const results = await Promise.all(
          activeEngagements.map(async (eng) => {
            const items = await fetchEngagementOnboarding(token, eng.id);
            return {
              id: eng.id,
              developerName: eng.developerName,
              completed: items.filter((i) => i.isCompleted).length,
              total: items.length,
            };
          }),
        );

        if (!cancelled) {
          // Only show engagements with incomplete onboarding
          setProgressData(results.filter((r) => r.total > 0 && r.completed < r.total));
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, [activeEngagements.length]);

  if (loading || progressData.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Developer Onboarding</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {progressData.map((eng) => {
          const pct = Math.round((eng.completed / eng.total) * 100);
          return (
            <Link
              key={eng.id}
              href="/companies/dashboard/engagements"
              className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{eng.developerName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {eng.completed}/{eng.total}
                  </p>
                </div>
                <Progress value={pct} className="mt-1.5 h-1" />
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { OnboardingProgressWidget };
