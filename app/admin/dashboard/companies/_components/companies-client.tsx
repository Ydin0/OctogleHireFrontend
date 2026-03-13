"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import type { CompanyProfile } from "@/lib/api/companies";
import { deleteCompany, createCompany, type CreateCompanyPayload } from "@/lib/api/companies";
import type { Pagination } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BulkActionsBar } from "./bulk-actions-bar";

const TABS = [
  { value: "active", label: "Active" },
  { value: "enquiries", label: "Enquiries" },
  { value: "all", label: "All" },
] as const;

const ENQUIRY_STATUSES = new Set(["enquired", "pending", "contacted"]);

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

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Create state
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateCompanyPayload>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
  });

  const currentTab = searchParams.get("tab") ?? "active";
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

    // Tab filter
    if (currentTab === "active") {
      result = result.filter((c) => c.status === "active");
    } else if (currentTab === "enquiries") {
      result = result.filter((c) => ENQUIRY_STATUSES.has(c.status));
    }
    // "all" → no tab filter

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
    currentTab,
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    const result = await deleteCompany(token, deleteTarget.id);

    if (result.ok) {
      setDeleteTarget(null);
      startTransition(() => {
        router.refresh();
      });
    } else {
      setDeleteError(result.message ?? "Failed to delete company");
    }
    setDeleting(false);
  };

  const handleCreate = async () => {
    if (!createForm.companyName || !createForm.contactName || !createForm.email) return;
    setCreating(true);
    setCreateError(null);

    const result = await createCompany(token, createForm);

    if (result) {
      setCreateOpen(false);
      setCreateForm({ companyName: "", contactName: "", email: "", phone: "", website: "", location: "" });
      startTransition(() => {
        router.refresh();
      });
    } else {
      setCreateError("Failed to create company");
    }
    setCreating(false);
  };

  const columns = getColumns({
    enableSelection: true,
    onDelete: (company) => {
      setDeleteError(null);
      setDeleteTarget(company);
    },
  });

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("status");
    if (tab === "active") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Track company enquiries, requirements, and engagement status.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 size-3.5" />
          Add Company
        </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.companyName}</strong>? This will
              remove the company and all associated requirements and team members. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Company Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>
              Create a new company record manually.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="create-companyName">Company Name *</Label>
              <Input
                id="create-companyName"
                value={createForm.companyName}
                onChange={(e) => setCreateForm((f) => ({ ...f, companyName: e.target.value }))}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-contactName">Contact Name *</Label>
              <Input
                id="create-contactName"
                value={createForm.contactName}
                onChange={(e) => setCreateForm((f) => ({ ...f, contactName: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="john@acme.com"
              />
              {createForm.email.includes("@") && (
                <p className="text-xs text-muted-foreground">
                  Domain: {createForm.email.split("@")[1]?.toLowerCase()} — logo will be fetched automatically
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-phone">Phone</Label>
              <Input
                id="create-phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 555 123 4567"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-website">Website</Label>
              <Input
                id="create-website"
                value={createForm.website}
                onChange={(e) => setCreateForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://acme.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-location">Location</Label>
              <Input
                id="create-location"
                value={createForm.location}
                onChange={(e) => setCreateForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="New York, NY"
              />
            </div>
          </div>
          {createError && (
            <p className="text-sm text-destructive">{createError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !createForm.companyName || !createForm.contactName || !createForm.email}
            >
              {creating ? "Creating..." : "Create Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { CompaniesClient };
