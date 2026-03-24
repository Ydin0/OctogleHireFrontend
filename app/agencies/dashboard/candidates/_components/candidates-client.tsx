"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { UnifiedCandidate, Pagination } from "@/lib/api/agencies";
import { DataTable } from "@/app/admin/dashboard/_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";
import { AddDeveloperDialog } from "./add-developer-dialog";
import { BulkImportDialog } from "./bulk-import-dialog";

interface CandidatesClientProps {
  candidates: UnifiedCandidate[];
  pagination: Pagination;
}

function CandidatesClient({ candidates, pagination }: CandidatesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

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

      <FiltersBar />

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
