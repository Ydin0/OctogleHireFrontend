"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { CompanyProfile } from "@/lib/api/companies";
import type { Pagination } from "@/lib/api/admin";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { FiltersBar } from "./filters-bar";
import { BulkActionsBar } from "./bulk-actions-bar";

interface CompaniesClientProps {
  companies: CompanyProfile[];
  token: string;
}

function CompaniesClient({ companies, token }: CompaniesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    {},
  );

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentReqStatus = searchParams.get("reqStatus") ?? "all";
  const currentEngagement = searchParams.get("engagementType") ?? "";
  const currentStack = searchParams.get("techStack") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") ?? "20", 10);

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

  // Client-side filtering
  const filteredCompanies = useMemo(() => {
    let result = companies;

    // Search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.contactName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }

    // Status
    if (currentStatus && currentStatus !== "all") {
      result = result.filter((c) => c.status === currentStatus);
    }

    // Requirement status filter
    if (currentReqStatus && currentReqStatus !== "all") {
      result = result.filter((c) => {
        switch (currentReqStatus) {
          case "has_open":
            return c.requirements.some((r) => r.status === "open");
          case "has_matching":
            return c.requirements.some((r) => r.status === "matching");
          case "has_filled":
            return c.requirements.some((r) => r.status === "filled");
          default:
            return true;
        }
      });
    }

    // Engagement type filter
    if (currentEngagement) {
      const types = currentEngagement.split(",");
      result = result.filter((c) =>
        c.requirements.some((r) => types.includes(r.engagementType)),
      );
    }

    // Tech stack filter
    if (currentStack) {
      const stacks = currentStack.split(",");
      result = result.filter((c) =>
        c.requirements.some((r) =>
          r.techStack.some((t) => stacks.includes(t)),
        ),
      );
    }

    return result;
  }, [
    companies,
    currentSearch,
    currentStatus,
    currentReqStatus,
    currentEngagement,
    currentStack,
  ]);

  // Client-side sorting
  const sortedCompanies = useMemo(() => {
    if (!currentSortBy) return filteredCompanies;

    const sorted = [...filteredCompanies];
    const order = currentSortOrder === "desc" ? -1 : 1;

    sorted.sort((a, b) => {
      switch (currentSortBy) {
        case "companyName":
          return order * a.companyName.localeCompare(b.companyName);
        case "contactName":
          return order * a.contactName.localeCompare(b.contactName);
        case "requirements": {
          const fillRate = (c: CompanyProfile) => {
            const needed = c.requirements.reduce((s, r) => s + r.developersNeeded, 0);
            if (needed === 0) return 0;
            const filled = c.requirements.reduce((s, r) => {
              const matches = r.proposedMatches ?? [];
              return s + matches.filter((m) => m.status === "accepted" || m.status === "active").length;
            }, 0);
            return filled / needed;
          };
          return order * (fillRate(a) - fillRate(b));
        }
        case "status":
          return order * a.status.localeCompare(b.status);
        case "createdAt":
          return (
            order *
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime())
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredCompanies, currentSortBy, currentSortOrder]);

  // Client-side pagination
  const total = sortedCompanies.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCompanies = sortedCompanies.slice(
    (safePage - 1) * currentLimit,
    safePage * currentLimit,
  );

  const pagination: Pagination = {
    page: safePage,
    limit: currentLimit,
    total,
    totalPages,
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

  const selectedIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((idx) => paginatedCompanies[parseInt(idx)]?.id)
    .filter(Boolean);

  const columns = getColumns({ enableSelection: true });

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Companies</h1>
        <p className="text-sm text-muted-foreground">
          Track company enquiries, requirements, and engagement status.
        </p>
      </div>

      <FiltersBar
        companies={companies}
        filteredCompanies={filteredCompanies}
      />

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
        data={paginatedCompanies}
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
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowClick={(company) =>
          router.push(`/admin/dashboard/companies/${company.id}`)
        }
      />
    </>
  );
}

export { CompaniesClient };
