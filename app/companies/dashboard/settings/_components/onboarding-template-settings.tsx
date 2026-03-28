"use client";

import { useState } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import type { OnboardingTemplateItem } from "@/lib/api/companies";
import { updateOnboardingTemplate } from "@/lib/api/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

const DEFAULT_ITEMS: OnboardingTemplateItem[] = [
  { key: "company_email", label: "Set up company email address", description: "Create a company email address for the developer.", category: "access", sortOrder: 0 },
  { key: "communication", label: "Add to communication channel (Slack/Discord/Teams)", description: "Invite the developer to your team's communication workspace.", category: "communication", sortOrder: 1 },
  { key: "notion", label: "Onboard onto Notion", description: "Grant access to company docs, wiki, and knowledge base in Notion.", category: "tooling", sortOrder: 2 },
  { key: "claude_code", label: "Set up Claude Code", description: "Configure Claude Code with team plan access for AI-assisted development.", category: "tooling", sortOrder: 3 },
  { key: "repo_access", label: "Grant repository access (GitHub/GitLab/Bitbucket)", description: "Add the developer to your source code repositories and organisation.", category: "access", sortOrder: 4 },
  { key: "project_management", label: "Set up project management tool (Linear/Jira/Asana)", description: "Add the developer to your project management workspace.", category: "tooling", sortOrder: 5 },
  { key: "jam", label: "Set up Jam for browser testing", description: "Install the Jam browser extension for bug reports and feature validation.", category: "tooling", sortOrder: 6 },
  { key: "dev_environment", label: "Set up local development environment", description: "Clone repos, configure environment variables, and verify builds run locally.", category: "setup", sortOrder: 7 },
  { key: "security_review", label: "Security & access review", description: "Review permissions, set up MFA, and go through security policies.", category: "access", sortOrder: 8 },
  { key: "intro_meeting", label: "Schedule kickoff meeting & assign first task", description: "Hold an introduction meeting with the team and assign the first piece of work.", category: "setup", sortOrder: 9 },
];

const CATEGORY_OPTIONS = [
  { value: "access", label: "Access" },
  { value: "communication", label: "Communication" },
  { value: "tooling", label: "Tooling" },
  { value: "setup", label: "Setup" },
];

interface OnboardingTemplateSettingsProps {
  initialItems: OnboardingTemplateItem[];
}

function OnboardingTemplateSettings({ initialItems }: OnboardingTemplateSettingsProps) {
  const { getToken } = useAuth();
  const [items, setItems] = useState<OnboardingTemplateItem[]>(
    initialItems.length > 0 ? initialItems : DEFAULT_ITEMS,
  );
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Adding state
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("setup");

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditLabel(items[index].label);
    setEditDescription(items[index].description);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditLabel("");
    setEditDescription("");
  }

  function saveEdit() {
    if (editingIndex === null || !editLabel.trim()) return;
    const updated = [...items];
    updated[editingIndex] = {
      ...updated[editingIndex],
      label: editLabel.trim(),
      description: editDescription.trim(),
    };
    setItems(updated);
    setHasChanges(true);
    cancelEdit();
  }

  function moveItem(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((item, i) => (item.sortOrder = i));
    setItems(updated);
    setHasChanges(true);
  }

  function removeItem(index: number) {
    const updated = items.filter((_, i) => i !== index);
    updated.forEach((item, i) => (item.sortOrder = i));
    setItems(updated);
    setHasChanges(true);
  }

  function addItem() {
    if (!newLabel.trim()) return;
    const newItem: OnboardingTemplateItem = {
      key: `custom_${Date.now()}`,
      label: newLabel.trim(),
      description: newDescription.trim(),
      category: newCategory,
      sortOrder: items.length,
    };
    setItems([...items, newItem]);
    setHasChanges(true);
    setNewLabel("");
    setNewDescription("");
    setNewCategory("setup");
    setAdding(false);
  }

  function resetToDefaults() {
    setItems([...DEFAULT_ITEMS]);
    setHasChanges(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const success = await updateOnboardingTemplate(token, items);
      if (success) {
        toast.success("Onboarding template saved");
        setHasChanges(false);
      } else {
        toast.error("Failed to save template");
      }
    } catch {
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Developer Onboarding Template</h2>
          <p className="text-sm text-muted-foreground">
            Customise the default onboarding checklist for new engagements. Changes apply to future engagements only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 size-3.5" />
            )}
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, index) => (
          <div
            key={item.key}
            className="group flex items-center gap-2 rounded-md border border-transparent px-2 py-2 hover:border-border hover:bg-muted/30"
          >
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                disabled={index === 0}
                onClick={() => moveItem(index, "up")}
              >
                <GripVertical className="size-3 rotate-90" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, "down")}
              >
                <GripVertical className="size-3 -rotate-90" />
              </Button>
            </div>

            {editingIndex === index ? (
              <div className="flex flex-1 flex-col gap-1.5">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="h-7 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={saveEdit}>
                    <Check className="mr-1 size-3" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={cancelEdit}>
                    <X className="mr-1 size-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
            )}

            <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.category}
            </span>

            {editingIndex !== index && (
              <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => startEdit(index)}
                >
                  <Pencil className="size-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="size-3 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {adding ? (
          <div className="rounded-md border p-3 space-y-2">
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Item name"
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem();
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              className="h-7 text-xs"
            />
            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-7 rounded-md border bg-background px-2 text-xs"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button size="sm" variant="outline" className="h-7" onClick={addItem} disabled={!newLabel.trim()}>
                Add
              </Button>
              <Button size="sm" variant="ghost" className="h-7" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 gap-1.5 text-muted-foreground"
            onClick={() => setAdding(true)}
          >
            <Plus className="size-3.5" />
            Add item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { OnboardingTemplateSettings };
