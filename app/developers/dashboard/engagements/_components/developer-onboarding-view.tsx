"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import type { DeveloperOnboardingChecklistItem } from "@/lib/api/developer";
import { fetchDeveloperEngagementOnboarding } from "@/lib/api/developer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DeveloperOnboardingViewProps {
  engagementId: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  access: "Access & Accounts",
  communication: "Communication",
  tooling: "Tooling",
  setup: "Setup",
};

const CATEGORY_ORDER = ["access", "communication", "tooling", "setup"];

function groupByCategory(items: DeveloperOnboardingChecklistItem[]) {
  const groups: Record<string, DeveloperOnboardingChecklistItem[]> = {};
  for (const item of items) {
    const cat = item.category ?? "setup";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return CATEGORY_ORDER
    .filter((cat) => groups[cat]?.length)
    .map((cat) => ({ category: cat, items: groups[cat] }));
}

function DeveloperOnboardingView({ engagementId }: DeveloperOnboardingViewProps) {
  const { getToken } = useAuth();
  const [items, setItems] = useState<DeveloperOnboardingChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        const data = await fetchDeveloperEngagementOnboarding(token, engagementId);
        if (!cancelled) setItems(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [engagementId]);

  if (loading || items.length === 0) return null;

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = completedCount === totalCount;

  const grouped = groupByCategory(items);

  return (
    <div className="mt-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-medium">Onboarding Progress</p>
          <span className="text-[10px] text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </Button>
      </div>

      <Progress value={progress} className="mt-2 h-1" />

      {allComplete && !expanded && (
        <p className="mt-2 text-xs text-emerald-600">All onboarding steps complete</p>
      )}

      {expanded && (
        <div className="mt-3 space-y-3">
          {grouped.map(({ category, items: groupItems }) => (
            <div key={category}>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[category] ?? category}
              </p>
              <div className="space-y-0.5">
                {groupItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 py-1">
                    <div
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                        item.isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border"
                      }`}
                    >
                      {item.isCompleted && <Check className="size-2.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${item.isCompleted ? "text-muted-foreground line-through" : "font-medium"}`}>
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { DeveloperOnboardingView };
