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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";
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

const ALL_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"] as const;

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
const fmtDay = (iso: string | undefined): string =>
  iso
    ? new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "…";

export function InvoiceFiltersBar({
  filters,
  companies,
  developers,
  currencies,
}: InvoiceFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Debounced search.
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  useEffect(() => setSearchInput(filters.search ?? ""), [filters.search]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput !== (filters.search ?? "")) push({ search: searchInput || undefined });
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
    params.delete("page");
    startTransition(() => router.push(`?${params.toString()}`));
  };
  const pushList = (key: string, values: string[]) =>
    push({ [key]: values.length > 0 ? values.join(",") : undefined });
  const removeFromList = (key: string, current: string[], value: string) =>
    pushList(key, current.filter((v) => v !== value));
  const clearAll = () =>
    startTransition(() => router.push(`?${new URLSearchParams().toString()}`));

  // ── Derived state ────────────────────────────────────────────────────
  const statuses = filters.statuses ?? [];
  const companyIds = filters.companyIds ?? [];
  const developerIds = filters.developerIds ?? [];
  const currencyVals = filters.currencies ?? [];

  const companyName = (id: string) =>
    companies.find((c) => c.id === id)?.name ?? id;
  const developerName = (id: string) =>
    developers.find((d) => d.id === id)?.name ?? id;

  const advancedCount = useMemo(() => {
    let n = 0;
    if (companyIds.length) n++;
    if (developerIds.length) n++;
    if (currencyVals.length) n++;
    if (filters.issuedFrom || filters.issuedTo) n++;
    if (filters.dueFrom || filters.dueTo) n++;
    if (filters.periodFrom || filters.periodTo) n++;
    if (filters.minTotal !== undefined || filters.maxTotal !== undefined) n++;
    if (filters.overdueOnly) n++;
    return n;
  }, [filters, companyIds.length, developerIds.length, currencyVals.length]);

  // ── Active filter chips ──────────────────────────────────────────────
  type Chip = { id: string; label: string; onRemove: () => void };
  const chips: Chip[] = [];
  if (filters.search)
    chips.push({ id: "search", label: `“${filters.search}”`, onRemove: () => { setSearchInput(""); push({ search: undefined }); } });
  for (const s of statuses)
    chips.push({ id: `s:${s}`, label: invoiceStatusLabel[s as keyof typeof invoiceStatusLabel] ?? s, onRemove: () => removeFromList("status", statuses, s) });
  for (const id of companyIds)
    chips.push({ id: `c:${id}`, label: companyName(id), onRemove: () => removeFromList("companyIds", companyIds, id) });
  for (const id of developerIds)
    chips.push({ id: `d:${id}`, label: developerName(id), onRemove: () => removeFromList("developerIds", developerIds, id) });
  for (const cc of currencyVals)
    chips.push({ id: `cur:${cc}`, label: cc, onRemove: () => removeFromList("currencies", currencyVals, cc) });
  if (filters.issuedFrom || filters.issuedTo)
    chips.push({ id: "issued", label: `Issued ${fmtDay(filters.issuedFrom)} – ${fmtDay(filters.issuedTo)}`, onRemove: () => push({ issuedFrom: undefined, issuedTo: undefined }) });
  if (filters.dueFrom || filters.dueTo)
    chips.push({ id: "due", label: `Due ${fmtDay(filters.dueFrom)} – ${fmtDay(filters.dueTo)}`, onRemove: () => push({ dueFrom: undefined, dueTo: undefined }) });
  if (filters.periodFrom || filters.periodTo)
    chips.push({ id: "period", label: `Period ${filters.periodFrom ?? "…"} – ${filters.periodTo ?? "…"}`, onRemove: () => push({ periodFrom: undefined, periodTo: undefined }) });
  if (filters.minTotal !== undefined || filters.maxTotal !== undefined)
    chips.push({ id: "amount", label: `Amount ${filters.minTotal ?? 0} – ${filters.maxTotal ?? "∞"}`, onRemove: () => push({ minTotal: undefined, maxTotal: undefined }) });
  if (filters.overdueOnly)
    chips.push({ id: "overdue", label: "Overdue only", onRemove: () => push({ overdueOnly: undefined }) });

  const csvUrl = buildInvoicesCsvUrl(filters);

  return (
    <div className="space-y-2.5">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search invoice number or company…"
            className="h-9 pl-9"
          />
        </div>

        {/* Status segmented pills */}
        <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
          {ALL_STATUSES.map((s) => {
            const active = statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() =>
                  active
                    ? removeFromList("status", statuses, s)
                    : pushList("status", [...statuses, s])
                }
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "bg-pulse text-pulse-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {invoiceStatusLabel[s]}
              </button>
            );
          })}
        </div>

        {/* Advanced filters popover */}
        <FiltersPopover
          advancedCount={advancedCount}
          filters={filters}
          companies={companies}
          developers={developers}
          currencies={currencies}
          companyIds={companyIds}
          developerIds={developerIds}
          currencyVals={currencyVals}
          push={push}
          pushList={pushList}
        />

        <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
          <a href={csvUrl} download>
            <Download className="size-3.5" />
            Export
          </a>
        </Button>
      </div>

      {/* ── Active filter chips ─────────────────────────────────────────── */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={chip.onRemove}
              className="group inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 py-1 pl-2.5 pr-1.5 text-xs transition-colors hover:border-foreground/30"
            >
              <span className="max-w-[180px] truncate">{chip.label}</span>
              <X className="size-3 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Advanced filters popover ────────────────────────────────────────────────

interface FiltersPopoverProps {
  advancedCount: number;
  filters: InvoiceFilters;
  companies: { id: string; name: string; logoUrl: string | null }[];
  developers: { id: string; name: string }[];
  currencies: string[];
  companyIds: string[];
  developerIds: string[];
  currencyVals: string[];
  push: (u: Record<string, string | undefined>) => void;
  pushList: (key: string, values: string[]) => void;
}

function FiltersPopover({
  advancedCount,
  filters,
  companies,
  developers,
  currencies,
  companyIds,
  developerIds,
  currencyVals,
  push,
  pushList,
}: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);

  // Controlled amount inputs (debounced push) so they always reflect state.
  const [minAmt, setMinAmt] = useState(filters.minTotal?.toString() ?? "");
  const [maxAmt, setMaxAmt] = useState(filters.maxTotal?.toString() ?? "");
  useEffect(() => setMinAmt(filters.minTotal?.toString() ?? ""), [filters.minTotal]);
  useEffect(() => setMaxAmt(filters.maxTotal?.toString() ?? ""), [filters.maxTotal]);
  useEffect(() => {
    const id = setTimeout(() => {
      const next = minAmt.trim() ? String(Number(minAmt)) : undefined;
      if (next !== (filters.minTotal?.toString() ?? undefined)) push({ minTotal: next });
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minAmt]);
  useEffect(() => {
    const id = setTimeout(() => {
      const next = maxAmt.trim() ? String(Number(maxAmt)) : undefined;
      if (next !== (filters.maxTotal?.toString() ?? undefined)) push({ maxTotal: next });
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAmt]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <SlidersHorizontal className="size-3.5" />
          Filters
          {advancedCount > 0 && (
            <Badge variant="secondary" className="ml-0.5 rounded-full px-1.5">
              {advancedCount}
            </Badge>
          )}
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(680px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Filters</p>
          {advancedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() =>
                push({
                  companyIds: undefined,
                  developerIds: undefined,
                  currencies: undefined,
                  issuedFrom: undefined,
                  issuedTo: undefined,
                  dueFrom: undefined,
                  dueTo: undefined,
                  periodFrom: undefined,
                  periodTo: undefined,
                  minTotal: undefined,
                  maxTotal: undefined,
                  overdueOnly: undefined,
                })
              }
            >
              Reset
            </Button>
          )}
        </div>
        <Separator />

        <div className="grid max-h-[70vh] gap-x-5 gap-y-4 overflow-y-auto p-4 sm:grid-cols-2">
          <Field label="Clients">
            <MultiCombobox
              icon={<Building2 className="size-3.5" />}
              placeholder="Any client"
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
              selected={companyIds}
              onChange={(vals) => pushList("companyIds", vals)}
            />
          </Field>

          <Field label="Developer">
            <MultiCombobox
              icon={<Users className="size-3.5" />}
              placeholder="Any developer"
              options={developers.map((d) => ({ value: d.id, label: d.name }))}
              selected={developerIds}
              onChange={(vals) => pushList("developerIds", vals)}
            />
          </Field>

          <Field label="Currency">
            <MultiCombobox
              placeholder="Any currency"
              options={currencies.map((c) => ({ value: c, label: c }))}
              selected={currencyVals}
              onChange={(vals) => pushList("currencies", vals)}
            />
          </Field>

          <Field label="Overdue">
            <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-[var(--pulse)]"
                checked={!!filters.overdueOnly}
                onChange={(e) =>
                  push({ overdueOnly: e.target.checked ? "true" : undefined })
                }
              />
              Overdue only
            </label>
          </Field>

          <Field label="Issued from">
            <DatePicker
              value={isoToDate(filters.issuedFrom)}
              onChange={(d) => push({ issuedFrom: dateToIso(d) })}
            />
          </Field>
          <Field label="Issued to">
            <DatePicker
              value={isoToDate(filters.issuedTo)}
              onChange={(d) => push({ issuedTo: dateToIso(d) })}
            />
          </Field>

          <Field label="Due from">
            <DatePicker
              value={isoToDate(filters.dueFrom)}
              onChange={(d) => push({ dueFrom: dateToIso(d) })}
            />
          </Field>
          <Field label="Due to">
            <DatePicker
              value={isoToDate(filters.dueTo)}
              onChange={(d) => push({ dueTo: dateToIso(d) })}
            />
          </Field>

          <Field label="Period from">
            <MonthPicker
              value={filters.periodFrom ?? ""}
              onChange={(v) => push({ periodFrom: v || undefined })}
            />
          </Field>
          <Field label="Period to">
            <MonthPicker
              value={filters.periodTo ?? ""}
              onChange={(v) => push({ periodTo: v || undefined })}
            />
          </Field>

          <Field label="Amount min">
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={minAmt}
              onChange={(e) => setMinAmt(e.target.value)}
            />
          </Field>
          <Field label="Amount max">
            <Input
              type="number"
              inputMode="decimal"
              placeholder="∞"
              value={maxAmt}
              onChange={(e) => setMaxAmt(e.target.value)}
            />
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

// ── Multi-select combobox ───────────────────────────────────────────────────

interface MultiComboboxProps {
  icon?: React.ReactNode;
  placeholder: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}

function MultiCombobox({
  icon,
  placeholder,
  options,
  selected,
  onChange,
}: MultiComboboxProps) {
  const [open, setOpen] = useState(false);
  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? placeholder
        : `${selected.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full justify-between gap-1.5 font-normal"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            {icon}
            <span className="truncate">{triggerLabel}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>None found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const active = selected.includes(o.value);
                return (
                  <CommandItem
                    key={o.value}
                    onSelect={() =>
                      onChange(
                        active
                          ? selected.filter((v) => v !== o.value)
                          : [...selected, o.value],
                      )
                    }
                    className="cursor-pointer"
                  >
                    <Check className={cn("mr-2 size-3.5", active ? "opacity-100" : "opacity-0")} />
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
