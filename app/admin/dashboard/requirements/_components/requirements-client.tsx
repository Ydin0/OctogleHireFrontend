"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type { AdminRequirement, Pagination } from "@/lib/api/admin";
import {
  toggleRequirementFeatured,
  deleteAdminRequirement,
} from "@/lib/api/admin";
import { cn } from "@/lib/utils";
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
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";

interface RequirementsClientProps {
  requirements: AdminRequirement[];
  pagination: Pagination;
  token: string;
  statusCounts?: { all: number; open: number; filled: number; closed: number };
}

function RequirementsClient({
  requirements,
  pagination,
  token,
  statusCounts,
}: RequirementsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AdminRequirement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteRefs, setDeleteRefs] = useState<{ engagements: number; interviews: number; matches: number } | null>(null);

  const currentStatus = searchParams.get("status") ?? "open";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  const statusTabs = [
    { label: "Open", value: "open", count: statusCounts?.open },
    { label: "Filled", value: "filled", count: statusCounts?.filled },
    { label: "Closed", value: "closed", count: statusCounts?.closed },
    { label: "All", value: "all", count: statusCounts?.all },
  ];

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
    try {
      await toggleRequirementFeatured(token, req.id, !req.isFeatured);
      toast.success(req.isFeatured ? "Requirement unfeatured" : "Requirement featured");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async (force = false) => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteAdminRequirement(token, deleteTarget.id, force);

    if (result.success) {
      toast.success("Requirement deleted");
      setDeleteTarget(null);
      setDeleteRefs(null);
      startTransition(() => {
        router.refresh();
      });
    } else if (result.hasReferences && result.references) {
      setDeleteRefs(result.references);
    } else {
      toast.error("Failed to delete requirement");
      setDeleteError("Failed to delete requirement.");
    }
    setDeleting(false);
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
        <Button size="sm" asChild>
          <Link href="/admin/dashboard/requirements/new">
            <Plus className="mr-1.5 size-4" />
            New Requirement
          </Link>
        </Button>
      </div>

      <div className="flex gap-0 border-b border-border">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => pushParams({ status: tab.value, page: "" })}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentStatus === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                currentStatus === tab.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
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
