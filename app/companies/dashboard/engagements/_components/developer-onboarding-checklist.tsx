"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import type { OnboardingChecklistItem } from "@/lib/api/companies";
import {
  fetchEngagementOnboarding,
  toggleOnboardingItem,
  addOnboardingItem,
  deleteOnboardingItem,
} from "@/lib/api/companies";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

interface DeveloperOnboardingChecklistProps {
  engagementId: string;
  engagementStatus: string;
  token: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  access: "Access & Accounts",
  communication: "Communication",
  tooling: "Tooling",
  setup: "Setup",
};

const CATEGORY_ORDER = ["access", "communication", "tooling", "setup"];

function groupByCategory(items: OnboardingChecklistItem[]) {
  const groups: Record<string, OnboardingChecklistItem[]> = {};
  for (const item of items) {
    const cat = item.category ?? "setup";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return CATEGORY_ORDER
    .filter((cat) => groups[cat]?.length)
    .map((cat) => ({ category: cat, items: groups[cat] }));
}

function DeveloperOnboardingChecklist({
  engagementId,
  engagementStatus,
  token,
}: DeveloperOnboardingChecklistProps) {
  const [items, setItems] = useState<OnboardingChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const isReadOnly = engagementStatus === "ended";
  const isVisible = engagementStatus === "active" || engagementStatus === "pending" || engagementStatus === "ended";

  useEffect(() => {
    if (!isVisible) return;

    let cancelled = false;
    async function load() {
      try {
        const data = await fetchEngagementOnboarding(token, engagementId);
        if (!cancelled) setItems(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token, engagementId, isVisible]);

  if (!isVisible) return null;

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allComplete = totalCount > 0 && completedCount === totalCount;

  async function handleToggle(item: OnboardingChecklistItem) {
    if (isReadOnly) return;

    const newCompleted = !item.isCompleted;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, isCompleted: newCompleted, completedAt: newCompleted ? new Date().toISOString() : null }
          : i,
      ),
    );

    const result = await toggleOnboardingItem(token, engagementId, item.id, newCompleted);
    if (!result) {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isCompleted: !newCompleted, completedAt: item.completedAt } : i,
        ),
      );
      toast.error("Failed to update item");
    }
  }

  async function handleAddItem() {
    if (!newLabel.trim()) return;

    const result = await addOnboardingItem(token, engagementId, {
      label: newLabel.trim(),
    });

    if (result) {
      setItems((prev) => [...prev, result]);
      setNewLabel("");
      setAddingItem(false);
      toast.success("Item added");
    } else {
      toast.error("Failed to add item");
    }
  }

  async function handleDeleteItem(itemId: string) {
    const success = await deleteOnboardingItem(token, engagementId, itemId);
    if (success) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Item removed");
    } else {
      toast.error("Failed to remove item");
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-2 flex items-center gap-2">
          <ClipboardList className="size-3.5 text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Developer Onboarding</p>
        </div>
        <p className="text-sm text-muted-foreground">Loading checklist...</p>
      </div>
    );
  }

  if (items.length === 0) return null;

  const grouped = groupByCategory(items);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-3.5 text-muted-foreground" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Developer Onboarding</p>
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

      <Progress value={progress} className="mb-3 h-1.5" />

      {allComplete && !expanded && (
        <p className="text-sm text-emerald-600">All onboarding steps complete</p>
      )}

      {expanded && (
        <div className="space-y-4">
          {grouped.map(({ category, items: groupItems }) => (
            <div key={category}>
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[category] ?? category}
              </p>
              <div className="space-y-0.5">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={item.isCompleted}
                      onCheckedChange={() => handleToggle(item)}
                      disabled={isReadOnly}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${item.isCompleted ? "text-muted-foreground line-through" : "font-medium"}`}>
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                      {item.isCompleted && item.completedAt && (
                        <p className="text-[10px] text-muted-foreground">
                          Completed {new Date(item.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      )}
                    </div>
                    {!isReadOnly && item.itemKey.startsWith("custom_") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="size-3 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!isReadOnly && (
            <div className="pt-1">
              {addingItem ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter item name..."
                    className="h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddItem();
                      if (e.key === "Escape") {
                        setAddingItem(false);
                        setNewLabel("");
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="outline" onClick={handleAddItem} disabled={!newLabel.trim()}>
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingItem(false);
                      setNewLabel("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                  onClick={() => setAddingItem(true)}
                >
                  <Plus className="size-3.5" />
                  Add custom item
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { DeveloperOnboardingChecklist };
