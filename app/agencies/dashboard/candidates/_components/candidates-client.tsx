"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RowSelectionState } from "@tanstack/react-table";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

import type { UnifiedCandidate, Pagination } from "@/lib/api/agencies";
import { bulkReassignSourcedBy } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/app/admin/dashboard/_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";
import { AddDeveloperDialog } from "./add-developer-dialog";
import { BulkImportDialog } from "./bulk-import-dialog";

interface SourcerOption {
  userId: string;
  name: string;
}

interface CandidatesClientProps {
  candidates: UnifiedCandidate[];
  pagination: Pagination;
  sourcers?: SourcerOption[];
  token: string;
}

function CandidatesClient({ candidates, pagination, sourcers = [], token }: CandidatesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkAssignee, setBulkAssignee] = useState("");
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

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

  const columns = getColumns();

  const availableStacks = useMemo(() => {
    const set = new Set<string>();
    for (const c of candidates) {
      for (const s of c.primaryStack ?? []) set.add(s);
    }
    return [...set].sort();
  }, [candidates]);

  // Get selected candidate IDs (only application-type, not saved)
  const selectedIds = Object.keys(rowSelection)
    .filter((idx) => rowSelection[idx])
    .map((idx) => candidates[Number(idx)])
    .filter((c) => c?.sourceTable === "application")
    .map((c) => c.id);

  const handleBulkReassign = async () => {
    if (!bulkAssignee || selectedIds.length === 0) return;
    setBulkSubmitting(true);
    const member = sourcers.find((s) => s.userId === bulkAssignee);
    const result = await bulkReassignSourcedBy(
      token,
      selectedIds,
      bulkAssignee,
      member?.name ?? "",
    );
    if (result) {
      toast.success(`Reassigned ${result.updated} candidate${result.updated !== 1 ? "s" : ""}`);
      setRowSelection({});
      setBulkAssignee("");
      startTransition(() => router.refresh());
    } else {
      toast.error("Failed to reassign candidates");
    }
    setBulkSubmitting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            All candidates from referrals and LinkedIn prospecting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkImportDialog />
          <AddDeveloperDialog />
        </div>
      </div>

      <FiltersBar availableStacks={availableStacks} sourcers={sourcers} />

      {/* Bulk action bar */}
      {selectedIds.length > 0 && sourcers.length > 0 && (
        <div className="flex items-center gap-3 rounded-md border border-pulse/30 bg-pulse/5 px-4 py-2.5">
          <Users className="size-4 text-pulse" />
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <Select value={bulkAssignee} onValueChange={setBulkAssignee}>
            <SelectTrigger className="w-[200px] h-8 text-xs">
              <SelectValue placeholder="Reassign to..." />
            </SelectTrigger>
            <SelectContent>
              {sourcers.map((s) => (
                <SelectItem key={s.userId} value={s.userId}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            disabled={!bulkAssignee || bulkSubmitting}
            onClick={handleBulkReassign}
          >
            {bulkSubmitting ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : null}
            Reassign
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRowSelection({})}
          >
            Clear
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={candidates}
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
            ? { column: currentSortBy, order: currentSortOrder as "asc" | "desc" }
            : undefined
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(candidate) => {
          const href =
            candidate.sourceTable === "saved"
              ? `/agencies/dashboard/candidates/${candidate.id}?source=saved`
              : `/agencies/dashboard/candidates/${candidate.id}`;
          router.push(href);
        }}
      />
    </>
  );
}

export { CandidatesClient };
