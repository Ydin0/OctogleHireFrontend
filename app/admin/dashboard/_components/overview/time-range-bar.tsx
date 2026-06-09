"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarRange, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CHIPS: { key: "7d" | "30d" | "90d" | "12m"; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "12m", label: "12 months" },
];

interface TimeRangeBarProps {
  range: string;
  from: string;
  to: string;
}

/**
 * Time-range selector for the admin dashboard.
 *
 * Preset chips push a `range=<key>` URL param and clear from/to so the page
 * server-component resolves the window. The "Custom" popover lets the user
 * pick explicit dates and writes `range=custom&from=&to=`.
 */
export function TimeRangeBar({ range, from, to }: TimeRangeBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const setPreset = (key: "7d" | "30d" | "90d" | "12m") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", key);
    params.delete("from");
    params.delete("to");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const setCustom = (fromDate: Date | undefined, toDate: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    if (fromDate) params.set("from", fromDate.toISOString().slice(0, 10));
    if (toDate) params.set("to", toDate.toISOString().slice(0, 10));
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-wrap items-center gap-1">
      {CHIPS.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => setPreset(c.key)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            range === c.key
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          {c.label}
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`gap-1.5 ${
              range === "custom"
                ? "border-foreground bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                : ""
            }`}
          >
            <CalendarRange className="size-3.5" />
            {range === "custom" ? `${fmt(from)} – ${fmt(to)}` : "Custom"}
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">From</Label>
              <DatePicker
                value={from ? new Date(from + "T00:00:00") : undefined}
                onChange={(d) =>
                  setCustom(d, to ? new Date(to + "T00:00:00") : undefined)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To</Label>
              <DatePicker
                value={to ? new Date(to + "T00:00:00") : undefined}
                onChange={(d) =>
                  setCustom(from ? new Date(from + "T00:00:00") : undefined, d)
                }
              />
            </div>
          </div>
          {range === "custom" && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-xs text-muted-foreground"
              onClick={() => {
                setPreset("30d");
                setOpen(false);
              }}
            >
              <X className="mr-1.5 size-3" />
              Back to 30 days
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
