"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreHorizontal, Search, Check, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import type { EngagementChangeRequestAdmin } from "@/lib/api/engagement-change-requests";
import type { Pagination } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ChangeRequestType,
  type ChangeRequestStatus,
  changeRequestTypeBadgeClass,
  changeRequestTypeLabel,
  changeRequestStatusBadgeClass,
  changeRequestStatusLabel,
  formatCurrency,
  formatDate,
} from "../../_components/dashboard-data";
import { DataTable } from "../../_components/data-table";
import { ReviewDialog } from "./review-dialog";

interface ChangeRequestsClientProps {
  requests: EngagementChangeRequestAdmin[];
  token: string;
}

function ChangeRequestsClient({ requests, token }: ChangeRequestsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [reviewRequest, setReviewRequest] = useState<EngagementChangeRequestAdmin | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentType = searchParams.get("type") ?? "all";
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") ?? "20", 10);

  const [searchValue, setSearchValue] = useState(currentSearch);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        pushParams({ search: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, pushParams]);

  // Client-side filtering
  const filteredRequests = useMemo(() => {
    let result = requests;

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.companyName.toLowerCase().includes(q) ||
          r.developerName.toLowerCase().includes(q),
      );
    }

    if (currentStatus && currentStatus !== "all") {
      result = result.filter((r) => r.status === currentStatus);
    }

    if (currentType && currentType !== "all") {
      result = result.filter((r) => r.type === currentType);
    }

    return result;
  }, [requests, currentSearch, currentStatus, currentType]);

  // Client-side pagination
  const total = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRequests = filteredRequests.slice(
    (safePage - 1) * currentLimit,
    safePage * currentLimit,
  );

  const pagination: Pagination = {
    page: safePage,
    limit: currentLimit,
    total,
    totalPages,
  };

  // Summary stats
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const approvedThisMonth = requests.filter(
    (r) =>
      r.status === "approved" &&
      r.updatedAt.startsWith(currentMonth),
  ).length;

  const columns: ColumnDef<EngagementChangeRequestAdmin>[] = [
    {
      accessorKey: "companyName",
      header: "Company",
      size: 140,
      cell: ({ row }) => (
        <p className="truncate text-sm font-medium">{row.original.companyName}</p>
      ),
    },
    {
      accessorKey: "developerName",
      header: "Developer",
      size: 140,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.developerName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.developerRole}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 120,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={changeRequestTypeBadgeClass(row.original.type as ChangeRequestType)}
        >
          {changeRequestTypeLabel[row.original.type as ChangeRequestType]}
        </Badge>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      size: 200,
      cell: ({ row }) => (
        <p className="max-w-[200px] truncate text-sm text-muted-foreground">
          {row.original.reason}
        </p>
      ),
    },
    {
      accessorKey: "requestedEffectiveDate",
      header: "Effective Date",
      size: 110,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.requestedEffectiveDate}</span>
      ),
    },
    {
      id: "details",
      header: "Details",
      size: 120,
      cell: ({ row }) => {
        const r = row.original;
        if (r.type === "hour_reduction" && r.requestedMonthlyHours) {
          return (
            <span className="font-mono text-sm">
              {r.currentMonthlyHours ?? "?"}h &rarr; {r.requestedMonthlyHours}h
            </span>
          );
        }
        if (r.type === "extension" && r.requestedEndDate) {
          return <span className="font-mono text-sm">&rarr; {r.requestedEndDate}</span>;
        }
        return <span className="text-xs text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={changeRequestStatusBadgeClass(row.original.status as ChangeRequestStatus)}
        >
          {changeRequestStatusLabel[row.original.status as ChangeRequestStatus]}
        </Badge>
      ),
    },
    {
      id: "actions",
      size: 50,
      cell: ({ row }) => {
        const r = row.original;
        if (r.status !== "pending") return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setReviewRequest(r)}>
                <Check className="mr-2 size-4" />
                Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Change Requests</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage engagement change requests from companies.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Total Requests
            </p>
            <p className="mt-1 text-2xl font-semibold">{totalRequests}</p>
          </CardContent>
        </Card>
        <Card className={pendingCount > 0 ? "border-amber-600/20" : undefined}>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Pending Review
            </p>
            <p className="mt-1 text-2xl font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Approved This Month
            </p>
            <p className="mt-1 text-2xl font-semibold">{approvedThisMonth}</p>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company or developer..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={currentStatus}
          onValueChange={(v) => pushParams({ status: v })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={currentType}
          onValueChange={(v) => pushParams({ type: v })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="cancellation">Cancellation</SelectItem>
            <SelectItem value="hour_reduction">Hour Reduction</SelectItem>
            <SelectItem value="extension">Extension</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedRequests}
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
      />

      <ReviewDialog
        open={!!reviewRequest}
        onOpenChange={(open) => {
          if (!open) setReviewRequest(null);
        }}
        request={reviewRequest}
        token={token}
      />
    </>
  );
}

export { ChangeRequestsClient };
