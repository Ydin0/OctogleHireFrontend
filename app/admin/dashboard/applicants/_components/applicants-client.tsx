"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { AdminApplication, FilterOptions, Pagination } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";
import { BulkActionsBar } from "./bulk-actions-bar";
import { QuickNoteDialog } from "./quick-note-dialog";

const TABS = [
  { value: "in_progress", label: "In Progress" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

interface ApplicantsClientProps {
  applications: AdminApplication[];
  pagination: Pagination;
  currentSearch: string;
  currentStatus: string;
  filterOptions: FilterOptions | null;
  token: string;
}

function ApplicantsClient({
  applications,
  pagination,
  filterOptions,
  token,
}: ApplicantsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [quickNoteApp, setQuickNoteApp] = useState<AdminApplication | null>(null);

  const currentTab = searchParams.get("tab") ?? "in_progress";
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
        // Clear sort
        pushParams({ sortBy: "", sortOrder: "" });
      }
    } else {
      pushParams({ sortBy: column, sortOrder: "asc" });
    }
  };

  const selectedIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((idx) => applications[parseInt(idx)]?.id)
    .filter(Boolean);

  const columns = getColumns({
    onQuickNote: setQuickNoteApp,
    enableSelection: true,
  });

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Reset page, status selection when switching tabs
    params.delete("page");
    params.delete("status");
    if (tab === "in_progress") {
      params.delete("tab"); // default, keep URL clean
    } else {
      params.set("tab", tab);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-lg font-semibold">Applicants</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage developer applications through the pipeline.
          </p>
        </div>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {pagination.total.toLocaleString()}{" "}
          <span className="text-xs">
            {pagination.total === 1 ? "candidate" : "candidates"}
          </span>
        </span>
      </div>

      <div className="flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => switchTab(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                currentTab === tab.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      <FiltersBar filterOptions={filterOptions} token={token} />

      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedIds={selectedIds}
          token={token}
          onComplete={() => {
            setRowSelection({});
            startTransition(() => {
              router.refresh();
            });
          }}
        />
      )}

      <DataTable
        columns={columns}
        data={applications}
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
        onRowClick={(app) =>
          router.push(`/admin/dashboard/applicants/${app.id}`)
        }
      />

      <QuickNoteDialog
        application={quickNoteApp}
        token={token}
        onClose={() => setQuickNoteApp(null)}
      />
    </>
  );
}

export { ApplicantsClient };
