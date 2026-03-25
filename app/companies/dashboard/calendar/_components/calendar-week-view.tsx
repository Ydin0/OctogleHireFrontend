"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import type {
  CalendarBusyBlock,
  CalendarInterview,
  CompanyAvailabilitySlot,
} from "@/lib/api/companies";
import { deleteCompanySlot } from "@/lib/api/companies";
import { Button } from "@/components/ui/button";
import { AvailabilitySlotDialog } from "./availability-slot-dialog";

// ── Helpers ─────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am–8pm
const HOUR_HEIGHT = 60; // px per hour

function getWeekDates(weekOffset: number): Date[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatDayNum(date: Date): string {
  return date.getDate().toString();
}

function formatMonthYear(dates: Date[]): string {
  const first = dates[0];
  const last = dates[6];
  if (first.getMonth() === last.getMonth()) {
    return first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  return `${first.toLocaleDateString("en-US", { month: "short" })} – ${last.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function getBlockPosition(
  startStr: string,
  endStr: string,
  dayStart: Date,
): { top: number; height: number } | null {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(20, 0, 0, 0);
  const dayStartHour = new Date(dayStart);
  dayStartHour.setHours(8, 0, 0, 0);

  if (end <= dayStartHour || start >= dayEnd) return null;

  const clampedStart = start < dayStartHour ? dayStartHour : start;
  const clampedEnd = end > dayEnd ? dayEnd : end;

  const startMinutes =
    (clampedStart.getHours() - 8) * 60 + clampedStart.getMinutes();
  const endMinutes =
    (clampedEnd.getHours() - 8) * 60 + clampedEnd.getMinutes();

  return {
    top: (startMinutes / 60) * HOUR_HEIGHT,
    height: Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 4),
  };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// ── Component ───────────────────────────────────────────────────────────────

interface CalendarWeekViewProps {
  busyBlocks: CalendarBusyBlock[];
  interviews: CalendarInterview[];
  slots: CompanyAvailabilitySlot[];
  token: string;
  onSlotCreated: () => void;
  onCreateSlot: (slot: {
    startTime: string;
    endTime: string;
    timezone: string;
  }) => Promise<void>;
  onWeekChange: (start: string, end: string) => void;
}

export function CalendarWeekView({
  busyBlocks,
  interviews,
  slots,
  token,
  onSlotCreated,
  onCreateSlot,
  onWeekChange,
}: CalendarWeekViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const changeWeek = (delta: number) => {
    const newOffset = weekOffset + delta;
    setWeekOffset(newOffset);
    const dates = getWeekDates(newOffset);
    const start = dates[0].toISOString();
    const end = new Date(dates[6].getTime() + 86400000).toISOString();
    onWeekChange(start, end);
  };

  const handleCellClick = (dayIndex: number, hour: number) => {
    const date = weekDates[dayIndex];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setSelectedTime(`${String(hour).padStart(2, "0")}:00`);
    setSlotDialogOpen(true);
  };

  const handleDeleteSlot = async (slotId: string) => {
    const ok = await deleteCompanySlot(token, slotId);
    if (ok) {
      toast.success("Slot removed");
      onSlotCreated();
    } else {
      toast.error("Failed to remove slot");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{formatMonthYear(weekDates)}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setWeekOffset(0);
              const dates = getWeekDates(0);
              onWeekChange(dates[0].toISOString(), new Date(dates[6].getTime() + 86400000).toISOString());
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => changeWeek(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => changeWeek(1)}>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedDate(undefined);
              setSelectedTime(undefined);
              setSlotDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 size-3.5" />
            Add Slot
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-md border overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b bg-muted/30">
          <div className="border-r p-2" />
          {weekDates.map((date, i) => (
            <div
              key={i}
              className={`border-r last:border-r-0 p-2 text-center ${isToday(date) ? "bg-pulse/5" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {formatDay(date)}
              </p>
              <p
                className={`text-lg font-semibold ${isToday(date) ? "text-pulse" : ""}`}
              >
                {formatDayNum(date)}
              </p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {/* Time labels */}
          <div className="border-r">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex h-[60px] items-start justify-end border-b pr-2 pt-0.5"
              >
                <span className="text-[10px] font-mono text-muted-foreground">
                  {hour === 12
                    ? "12 PM"
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIdx) => (
            <div key={dayIdx} className="relative border-r last:border-r-0">
              {/* Hour grid lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] border-b cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleCellClick(dayIdx, hour)}
                />
              ))}

              {/* Busy blocks (grey) */}
              {busyBlocks.map((block, bi) => {
                const pos = getBlockPosition(block.startTime, block.endTime, date);
                if (!pos) return null;
                return (
                  <div
                    key={`busy-${bi}`}
                    className="absolute left-0.5 right-0.5 rounded bg-zinc-500/15 border border-zinc-500/10 pointer-events-none"
                    style={{ top: pos.top, height: pos.height }}
                  >
                    <p className="truncate px-1.5 pt-0.5 text-[10px] text-muted-foreground">
                      Busy
                    </p>
                  </div>
                );
              })}

              {/* Interviews (accent) */}
              {interviews
                .filter((iv) => isSameDay(new Date(iv.startTime), date))
                .map((iv) => {
                  const pos = getBlockPosition(iv.startTime, iv.endTime, date);
                  if (!pos) return null;
                  return (
                    <div
                      key={`iv-${iv.id}`}
                      className="absolute left-0.5 right-0.5 rounded bg-pulse/15 border border-pulse/25 pointer-events-none"
                      style={{ top: pos.top, height: pos.height }}
                    >
                      <div className="flex items-center gap-1 px-1.5 pt-0.5">
                        <Video className="size-2.5 shrink-0 text-pulse" />
                        <p className="truncate text-[10px] font-medium text-pulse">
                          {iv.title}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {/* Availability slots (green) */}
              {slots
                .filter(
                  (s) => !s.recurring && isSameDay(new Date(s.startTime), date),
                )
                .map((s) => {
                  const pos = getBlockPosition(s.startTime, s.endTime, date);
                  if (!pos) return null;
                  return (
                    <div
                      key={`slot-${s.id}`}
                      className="absolute left-0.5 right-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 group cursor-pointer"
                      style={{ top: pos.top, height: pos.height }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlot(s.id);
                      }}
                    >
                      <div className="flex items-center justify-between px-1.5 pt-0.5">
                        <p className="truncate text-[10px] font-medium text-emerald-600">
                          Available
                        </p>
                        <Trash2 className="size-2.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      <AvailabilitySlotDialog
        open={slotDialogOpen}
        onOpenChange={setSlotDialogOpen}
        defaultDate={selectedDate}
        defaultStartTime={selectedTime}
        onSave={async (slot) => {
          await onCreateSlot(slot);
          onSlotCreated();
        }}
      />
    </>
  );
}
