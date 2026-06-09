"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Check,
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import type { InvoiceFilters } from "@/lib/api/invoices";
import { buildInvoicesCsvUrl } from "@/lib/api/invoices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { invoiceStatusLabel } from "../../_components/dashboard-data";

const ALL_STATUSES = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;

interface InvoiceFiltersBarProps {
  filters: InvoiceFilters;
  companies: { id: string; name: string; logoUrl: string | null }[];
  developers: { id: string; name: string }[];
  currencies: string[];
}

const isoToDate = (s: string | undefined): Date | undefined =>
  s ? new Date(s + "T00:00:00") : undefined;
const dateToIso = (d: Date | undefined): string | undefined =>
  d ? d.toISOString().slice(0, 10) : undefined;

export function InvoiceFiltersBar({
  filters,
  companies,
  developers,
  currencies,
}: InvoiceFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Debounced search — keep local input state so typing isn't laggy.
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput !== (filters.search ?? "")) {
        push({ search: searchInput || undefined });
      }
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // ── URL push helpers ─────────────────────────────────────────────────
  const push = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "") params.delete(k);
      else params.set(k, v);
    }
    params.delete("page"); // any filter change → reset pagination
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const pushList = (key: string, values: string[]) => {
    push({ [key]: values.length > 0 ? values.join(",") : undefined });
  };

  const toggleListValue = (key: string, current: string[], value: string) => {
    pushList(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    // keep page+limit defaults out so we get a fresh slate
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // ── Derived state ────────────────────────────────────────────────────
  const statuses = filters.statuses ?? [];
  const companyIds = filters.companyIds ?? [];
  const developerIds = filters.developerIds ?? [];
  const currencyVals = filters.currencies ?? [];

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.search) n++;
    if (statuses.length) n++;
    if (companyIds.length) n++;
    if (developerIds.length) n++;
    if (currencyVals.length) n++;
    if (filters.issuedFrom || filters.issuedTo) n++;
    if (filters.dueFrom || filters.dueTo) n++;
    if (filters.periodFrom || filters.periodTo) n++;
    if (filters.minTotal !== undefined || filters.maxTotal !== undefined) n++;
    if (filters.overdueOnly) n++;
    return n;
  }, [
    filters,
    statuses.length,
    companyIds.length,
    developerIds.length,
    currencyVals.length,
  ]);

  const csvUrl = buildInvoicesCsvUrl(filters);

  return (
    <div className="space-y-3">
      {/* ── Top row ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search invoice number or company…"
            className="pl-9"
          />
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-1">
          {ALL_STATUSES.map((s) => {
            const active = statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleListValue("status", statuses, s)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {invoiceStatusLabel[s]}
              </button>
            );
          })}
        </div>

        {/* Clients combobox */}
        <MultiCombobox
          icon={<Building2 className="size-3.5" />}
          placeholder="Clients"
          options={companies.map((c) => ({ value: c.id, label: c.name }))}
          selected={companyIds}
          onChange={(vals) => pushList("companyIds", vals)}
        />

        {/* Issued range */}
        <DateRangePopover
          label="Issued"
          from={isoToDate(filters.issuedFrom)}
          to={isoToDate(filters.issuedTo)}
          onChange={(from, to) =>
            push({ issuedFrom: dateToIso(from), issuedTo: dateToIso(to) })
          }
        />

        {/* Due range */}
        <DateRangePopover
          label="Due"
          from={isoToDate(filters.dueFrom)}
          to={isoToDate(filters.dueTo)}
          onChange={(from, to) =>
            push({ dueFrom: dateToIso(from), dueTo: dateToIso(to) })
          }
        />

        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <a href={csvUrl} download>
            <Download className="size-3.5" />
            Export CSV
          </a>
        </Button>
      </div>

      {/* ── More filters (collapsible) ──────────────────────────────── */}
      <Collapsible>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <SlidersHorizontal className="size-3.5" />
              More filters
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeCount}
                </Badge>
              )}
              <ChevronDown className="size-3.5" />
            </Button>
          </CollapsibleTrigger>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="gap-1.5 text-muted-foreground"
            >
              <X className="size-3.5" />
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent className="mt-3 rounded-lg border bg-muted/30 p-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Period range */}
            <div className="space-y-1.5">
              <Label className="text-xs">Period (from)</Label>
              <MonthPicker
                value={filters.periodFrom ?? ""}
                onChange={(v) => push({ periodFrom: v || undefined })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Period (to)</Label>
              <MonthPicker
                value={filters.periodTo ?? ""}
                onChange={(v) => push({ periodTo: v || undefined })}
              />
            </div>

            {/* Currency multi */}
            <div className="space-y-1.5">
              <Label className="text-xs">Currency</Label>
              <MultiCombobox
                placeholder="Any currency"
                options={currencies.map((c) => ({ value: c, label: c }))}
                selected={currencyVals}
                onChange={(vals) => pushList("currencies", vals)}
                triggerSize="full"
              />
            </div>

            {/* Amount range */}
            <div className="space-y-1.5">
              <Label className="text-xs">Amount min</Label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                defaultValue={filters.minTotal ?? ""}
                onBlur={(e) =>
                  push({
                    minTotal: e.target.value ? String(Number(e.target.value)) : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Amount max</Label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="∞"
                defaultValue={filters.maxTotal ?? ""}
                onBlur={(e) =>
                  push({
                    maxTotal: e.target.value ? String(Number(e.target.value)) : undefined,
                  })
                }
              />
            </div>

            {/* Developer multi */}
            <div className="space-y-1.5">
              <Label className="text-xs">Developer</Label>
              <MultiCombobox
                icon={<Users className="size-3.5" />}
                placeholder="Any developer"
                options={developers.map((d) => ({ value: d.id, label: d.name }))}
                selected={developerIds}
                onChange={(vals) => pushList("developerIds", vals)}
                triggerSize="full"
              />
            </div>

            {/* Overdue toggle */}
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <Checkbox
                  checked={!!filters.overdueOnly}
                  onCheckedChange={(v) =>
                    push({ overdueOnly: v ? "true" : undefined })
                  }
                />
                Overdue only
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

interface MultiComboboxProps {
  icon?: React.ReactNode;
  placeholder: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  triggerSize?: "compact" | "full";
}

function MultiCombobox({
  icon,
  placeholder,
  options,
  selected,
  onChange,
  triggerSize = "compact",
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? placeholder
        : `${placeholder} · ${selected.length}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 ${triggerSize === "full" ? "w-full justify-between" : ""}`}
        >
          {icon}
          <span className="truncate">{triggerLabel}</span>
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selected.length}
            </Badge>
          )}
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search…`} />
          <CommandList>
            <CommandEmpty>None found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const active = selected.includes(o.value);
                return (
                  <CommandItem
                    key={o.value}
                    onSelect={() => {
                      onChange(
                        active
                          ? selected.filter((v) => v !== o.value)
                          : [...selected, o.value],
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 size-3.5 ${active ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className="truncate">{o.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface DateRangeProps {
  label: string;
  from: Date | undefined;
  to: Date | undefined;
  onChange: (from: Date | undefined, to: Date | undefined) => void;
}

function DateRangePopover({ label, from, to, onChange }: DateRangeProps) {
  const [open, setOpen] = useState(false);
  const fmt = (d?: Date) =>
    d?.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const valueText =
    from || to
      ? `${fmt(from) ?? "…"} – ${fmt(to) ?? "…"}`
      : label;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="text-sm">{valueText}</span>
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">From</Label>
            <DatePicker
              value={from}
              onChange={(d) => onChange(d, to)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <DatePicker
              value={to}
              onChange={(d) => onChange(from, d)}
            />
          </div>
        </div>
        {(from || to) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-xs text-muted-foreground"
            onClick={() => onChange(undefined, undefined)}
          >
            <X className="mr-1.5 size-3" />
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
