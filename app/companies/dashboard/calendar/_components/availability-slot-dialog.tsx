"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvailabilitySlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultStartTime?: string; // "HH:MM"
  timezone: string;
  onSave: (slot: {
    startTime: string;
    endTime: string;
    timezone: string;
  }) => Promise<void>;
}

export function AvailabilitySlotDialog({
  open,
  onOpenChange,
  defaultDate,
  defaultStartTime,
  timezone,
  onSave,
}: AvailabilitySlotDialogProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate ?? new Date());
  const [startTime, setStartTime] = useState(defaultStartTime ?? "09:00");
  const [endTime, setEndTime] = useState(
    defaultStartTime
      ? `${String(Math.min(Number(defaultStartTime.split(":")[0]) + 1, 23)).padStart(2, "0")}:00`
      : "10:00",
  );
  const [saving, setSaving] = useState(false);

  // Reset state when dialog opens with new defaults
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDate(defaultDate ?? new Date());
      setStartTime(defaultStartTime ?? "09:00");
      setEndTime(
        defaultStartTime
          ? `${String(Math.min(Number(defaultStartTime.split(":")[0]) + 1, 23)).padStart(2, "0")}:00`
          : "10:00",
      );
    }
    onOpenChange(isOpen);
  };

  const handleSave = async () => {
    if (!date) return;
    setSaving(true);
    const dateStr = format(date, "yyyy-MM-dd");
    await onSave({
      startTime: `${dateStr}T${startTime}:00`,
      endTime: `${dateStr}T${endTime}:00`,
      timezone,
    });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Availability Slot</DialogTitle>
          <DialogDescription>
            Set a time block when you're available for interviews.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker
              value={date}
              onChange={(d) => setDate(d)}
              placeholder="Select date"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <TimePicker value={startTime} onChange={setStartTime} />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <TimePicker value={endTime} onChange={setEndTime} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Timezone: {timezone}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !date || !startTime || !endTime}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Slot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
