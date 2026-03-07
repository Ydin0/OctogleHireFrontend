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

const AGENCY_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "prospected", label: "Prospected" },
  { value: "contacted", label: "Contacted" },
  { value: "interviewing", label: "Interviewing" },
  { value: "draft", label: "Draft" },
  { value: "hr_communication_round", label: "HR Communication" },
  { value: "ai_technical_examination", label: "AI Technical Exam" },
  { value: "tech_lead_human_interview", label: "Tech Lead Interview" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "referral", label: "Referral" },
  { value: "extension", label: "Extension" },
] as const;

function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentSource = searchParams.get("source") ?? "all";

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
    [router, searchParams, startTransition]
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
          placeholder="Search by name, title, or location..."
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
          {AGENCY_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={currentSource}
        onValueChange={(v) => pushParams({ source: v })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Filter by source" />
        </SelectTrigger>
        <SelectContent>
          {SOURCE_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { FiltersBar };
