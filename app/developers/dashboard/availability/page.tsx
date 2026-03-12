"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Save, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type DeveloperAvailabilitySlot,
  fetchDeveloperAvailability,
  saveDeveloperAvailability,
} from "@/lib/api/developer";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
] as const;

const HOURS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return {
    value: hour,
    label: hour === 0 ? "12am" : hour < 12 ? `${hour}am` : hour === 12 ? "12pm" : `${hour - 12}pm`,
    startTime: `${String(hour).padStart(2, "0")}:00`,
    endTime: `${String(hour + 1).padStart(2, "0")}:00`,
  };
});

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Mexico_City",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Johannesburg",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function slotKey(dayOfWeek: number, startTime: string) {
  return `${dayOfWeek}-${startTime}`;
}

function slotsToSet(slots: DeveloperAvailabilitySlot[]): Set<string> {
  const set = new Set<string>();
  for (const s of slots) {
    set.add(slotKey(s.dayOfWeek, s.startTime));
  }
  return set;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSlots, setActiveSlots] = useState<Set<string>>(new Set());
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [savedMessage, setSavedMessage] = useState(false);

  // ── Fetch existing availability ───────────────────────────────────────────

  const loadAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const slots = await fetchDeveloperAvailability(token);
      if (slots && slots.length > 0) {
        setActiveSlots(slotsToSet(slots));
        setTimezone(slots[0].timezone);
      }
    } catch {
      // silently fail — user can still set availability
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // ── Slot toggling ─────────────────────────────────────────────────────────

  const toggleSlot = (dayOfWeek: number, startTime: string) => {
    const key = slotKey(dayOfWeek, startTime);
    setActiveSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setSavedMessage(false);
  };

  const toggleDay = (dayOfWeek: number) => {
    const allActive = HOURS.every((h) =>
      activeSlots.has(slotKey(dayOfWeek, h.startTime)),
    );

    setActiveSlots((prev) => {
      const next = new Set(prev);
      for (const h of HOURS) {
        const key = slotKey(dayOfWeek, h.startTime);
        if (allActive) {
          next.delete(key);
        } else {
          next.add(key);
        }
      }
      return next;
    });
    setSavedMessage(false);
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();
      const slots = Array.from(activeSlots).map((key) => {
        const [day, startTime] = key.split("-");
        const hourNum = parseInt(startTime.split(":")[0], 10);
        return {
          dayOfWeek: parseInt(day, 10),
          startTime,
          endTime: `${String(hourNum + 1).padStart(2, "0")}:00`,
        };
      });
      await saveDeveloperAvailability(token, { timezone, slots });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch {
      // handle error silently for now
    } finally {
      setSaving(false);
    }
  };

  // ── Count helpers ─────────────────────────────────────────────────────────

  const totalSlots = activeSlots.size;
  const daySlotCount = (dayOfWeek: number) =>
    HOURS.filter((h) => activeSlots.has(slotKey(dayOfWeek, h.startTime))).length;

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">Interview Availability</h1>
          <p className="text-sm text-muted-foreground">
            Set your weekly availability for interviews. Companies will use
            these windows when scheduling calls.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Availability"}
        </Button>
      </div>

      {savedMessage && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
          Availability saved successfully.
        </div>
      )}

      {/* Timezone + summary */}
      <div className="flex flex-wrap items-center gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Timezone
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Weekly Summary
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-semibold">
                {totalSlots}
              </span>
              <span className="text-sm text-muted-foreground">
                hour {totalSlots === 1 ? "slot" : "slots"} selected across{" "}
                {DAYS.filter((d) => daySlotCount(d.value) > 0).length} days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Click individual slots to toggle, or click a day header to select
            the entire day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid min-w-[700px] grid-cols-[60px_repeat(7,1fr)] gap-1">
              {/* Column headers — days */}
              <div /> {/* empty top-left corner */}
              {DAYS.map((day) => {
                const count = daySlotCount(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className="flex flex-col items-center gap-1 rounded-md px-2 py-2 text-center transition-colors hover:bg-muted/50"
                  >
                    <span className="text-xs font-medium">{day.label}</span>
                    {count > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {count}h
                      </Badge>
                    )}
                  </button>
                );
              })}

              {/* Hour rows */}
              {HOURS.map((hour) => (
                <>
                  {/* Row label */}
                  <div
                    key={`label-${hour.value}`}
                    className="flex items-center justify-end pr-2 text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {hour.label}
                  </div>

                  {/* Day cells */}
                  {DAYS.map((day) => {
                    const active = activeSlots.has(
                      slotKey(day.value, hour.startTime),
                    );
                    return (
                      <button
                        key={`${day.value}-${hour.value}`}
                        type="button"
                        onClick={() => toggleSlot(day.value, hour.startTime)}
                        className={`h-8 rounded-sm border transition-colors ${
                          active
                            ? "bg-pulse/20 border-pulse/40"
                            : "bg-muted/30 border-transparent hover:bg-muted/50"
                        }`}
                        aria-label={`${day.label} ${hour.label} ${active ? "available" : "unavailable"}`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
