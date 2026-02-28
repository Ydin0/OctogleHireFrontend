"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { payoutStatusLabel } from "../../_components/dashboard-data";

const ALL_PAYOUT_STATUSES = [
  "pending",
  "approved",
  "processing",
  "paid",
  "cancelled",
] as const;

function PayoutFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by developer or payout number..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={currentStatus}
        onValueChange={(v) => pushParams({ status: v })}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {ALL_PAYOUT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {payoutStatusLabel[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { PayoutFiltersBar };
