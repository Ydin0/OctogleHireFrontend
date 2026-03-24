"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import type { AdminRequirement, DeleteRequirementResult, Pagination } from "@/lib/api/admin";
import {
  toggleRequirementFeatured,
  deleteAdminRequirement,
  createAdminRequirement,
} from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";

interface CompanyOption {
  id: string;
  name: string;
}

interface RequirementsClientProps {
  requirements: AdminRequirement[];
  pagination: Pagination;
  token: string;
  companies: CompanyOption[];
}

const defaultCreateForm = {
  companyId: "",
  title: "",
  description: "",
  techStack: "",
  experienceLevel: "mid",
  priority: "medium",
  engagementType: "full-time",
  developersNeeded: "1",
  budgetMin: "",
  budgetMax: "",
  timezonePreference: "any",
  startDate: "",
};

function RequirementsClient({
  requirements,
  pagination,
  token,
  companies,
}: RequirementsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AdminRequirement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteRefs, setDeleteRefs] = useState<{ engagements: number; interviews: number; matches: number } | null>(null);

  // Create state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(defaultCreateForm);

  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSortChange = (column: string) => {
    if (currentSortBy === column) {
      if (currentSortOrder === "asc") {
        pushParams({ sortBy: column, sortOrder: "desc" });
      } else {
        pushParams({ sortBy: "", sortOrder: "" });
      }
    } else {
      pushParams({ sortBy: column, sortOrder: "asc" });
    }
  };

  const handleToggleFeatured = async (req: AdminRequirement) => {
    await toggleRequirementFeatured(token, req.id, !req.isFeatured);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleDelete = async (force = false) => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteAdminRequirement(token, deleteTarget.id, force);

    if (result.success) {
      setDeleteTarget(null);
      setDeleteRefs(null);
      startTransition(() => {
        router.refresh();
      });
    } else if (result.hasReferences && result.references) {
      setDeleteRefs(result.references);
    } else {
      setDeleteError("Failed to delete requirement.");
    }
    setDeleting(false);
  };

  const handleCreate = async () => {
    if (!createForm.companyId || !createForm.title.trim() || !createForm.description.trim()) {
      setCreateError("Company, title, and description are required.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    const result = await createAdminRequirement(token, {
      companyId: createForm.companyId,
      title: createForm.title.trim(),
      description: createForm.description.trim(),
      techStack: createForm.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceLevel: createForm.experienceLevel,
      priority: createForm.priority,
      engagementType: createForm.engagementType,
      developersNeeded: parseInt(createForm.developersNeeded) || 1,
      budgetMinCents: createForm.budgetMin ? Math.round(parseFloat(createForm.budgetMin) * 100) : null,
      budgetMaxCents: createForm.budgetMax ? Math.round(parseFloat(createForm.budgetMax) * 100) : null,
      timezonePreference: createForm.timezonePreference || "any",
      startDate: createForm.startDate || undefined,
    });

    if (result?.requirement) {
      setCreateOpen(false);
      setCreateForm(defaultCreateForm);
      router.push(`/admin/dashboard/requirements/${result.requirement.id}`);
    } else {
      setCreateError("Failed to create requirement.");
    }
    setCreating(false);
  };

  const columns = getColumns({
    onToggleFeatured: handleToggleFeatured,
    onDelete: (req) => {
      setDeleteError(null);
      setDeleteRefs(null);
      setDeleteTarget(req);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Requirements</h1>
          <p className="text-sm text-muted-foreground">
            Manage job requirements and control which appear in the agency
            marketplace.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setCreateForm(defaultCreateForm);
            setCreateError(null);
            setCreateOpen(true);
          }}
        >
          <Plus className="mr-1.5 size-4" />
          New Requirement
        </Button>
      </div>

      <FiltersBar />

      <DataTable
        columns={columns}
        data={requirements}
        pagination={pagination}
        onPageChange={(page) => pushParams({ page: String(page) })}
        onLimitChange={(limit) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("limit", String(limit));
          params.delete("page");
          startTransition(() => {
            router.push(`?${params.toString()}`);
          });
        }}
        onSortChange={handleSortChange}
        currentSort={
          currentSortBy
            ? {
                column: currentSortBy,
                order: currentSortOrder as "asc" | "desc",
              }
            : undefined
        }
        onRowClick={(req) =>
          router.push(`/admin/dashboard/requirements/${req.id}`)
        }
      />

      {/* Create Requirement Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setCreateError(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Requirement</DialogTitle>
            <DialogDescription>
              Create a requirement on behalf of a company.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Select
                value={createForm.companyId}
                onValueChange={(v) => setCreateForm((f) => ({ ...f, companyId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={createForm.title}
                onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Senior React Developer"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={createForm.description}
                onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="Describe the role requirements..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tech Stack (comma-separated)</Label>
              <Input
                value={createForm.techStack}
                onChange={(e) => setCreateForm((f) => ({ ...f, techStack: e.target.value }))}
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Experience Level</Label>
                <Select
                  value={createForm.experienceLevel}
                  onValueChange={(v) => setCreateForm((f) => ({ ...f, experienceLevel: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["junior", "mid", "senior", "lead", "principal"].map((l) => (
                      <SelectItem key={l} value={l}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={createForm.priority}
                  onValueChange={(v) => setCreateForm((f) => ({ ...f, priority: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high", "urgent"].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Engagement Type</Label>
                <Select
                  value={createForm.engagementType}
                  onValueChange={(v) => setCreateForm((f) => ({ ...f, engagementType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["full-time", "part-time", "contract", "project-based"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Developers Needed</Label>
                <Input
                  type="number"
                  value={createForm.developersNeeded}
                  onChange={(e) => setCreateForm((f) => ({ ...f, developersNeeded: e.target.value }))}
                  min={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Budget Min ($)</Label>
                <Input
                  type="number"
                  value={createForm.budgetMin}
                  onChange={(e) => setCreateForm((f) => ({ ...f, budgetMin: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Budget Max ($)</Label>
                <Input
                  type="number"
                  value={createForm.budgetMax}
                  onChange={(e) => setCreateForm((f) => ({ ...f, budgetMax: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Timezone Preference</Label>
                <Input
                  value={createForm.timezonePreference}
                  onChange={(e) => setCreateForm((f) => ({ ...f, timezonePreference: e.target.value }))}
                  placeholder="any"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {createError && <p className="text-sm text-destructive">{createError}</p>}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setCreateError(null);
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !createForm.companyId || !createForm.title.trim()}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Requirement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteRefs(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Requirement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.title}</strong> from{" "}
              <strong>{deleteTarget?.companyName}</strong>? This will also remove
              all associated matches. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteRefs && (
            <div className="rounded-md border border-orange-500/30 bg-orange-500/5 p-3 space-y-2">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                This requirement has linked records:
              </p>
              <div className="flex flex-wrap gap-2">
                {deleteRefs.engagements > 0 && (
                  <Badge variant="outline" className="border-orange-500/30 text-orange-600 dark:text-orange-400">
                    {deleteRefs.engagements} engagement{deleteRefs.engagements !== 1 ? "s" : ""}
                  </Badge>
                )}
                {deleteRefs.interviews > 0 && (
                  <Badge variant="outline" className="border-orange-500/30 text-orange-600 dark:text-orange-400">
                    {deleteRefs.interviews} interview{deleteRefs.interviews !== 1 ? "s" : ""}
                  </Badge>
                )}
                {deleteRefs.matches > 0 && (
                  <Badge variant="outline" className="border-orange-500/30 text-orange-600 dark:text-orange-400">
                    {deleteRefs.matches} match{deleteRefs.matches !== 1 ? "es" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Deleting will remove these linked records. Proceed with caution.
              </p>
            </div>
          )}

          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteTarget(null);
                setDeleteRefs(null);
                setDeleteError(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(!!deleteRefs)}
              disabled={deleting}
            >
              {deleting
                ? "Deleting..."
                : deleteRefs
                  ? "Delete Anyway"
                  : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { RequirementsClient };
