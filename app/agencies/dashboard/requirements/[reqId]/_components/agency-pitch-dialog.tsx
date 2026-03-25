"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type { PoolCandidate, PitchPayload } from "./types";

interface AgencyPitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDevs: PoolCandidate[];
  defaultCommissionRate: number;
  onSubmit: (pitches: PitchPayload[]) => Promise<unknown>;
}

const getInitials = (name: string | null) =>
  name
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

const AgencyPitchDialog = ({
  open,
  onOpenChange,
  selectedDevs,
  defaultCommissionRate,
  onSubmit,
}: AgencyPitchDialogProps) => {
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState("22");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [currency, setCurrency] = useState("USD");
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [devRates, setDevRates] = useState<
    Record<string, { hourlyRate: string; commissionRate: string }>
  >(() => {
    const initial: Record<
      string,
      { hourlyRate: string; commissionRate: string }
    > = {};
    for (const dev of selectedDevs) {
      initial[dev.id] = {
        hourlyRate: String(dev.hourlyRate ?? 0),
        commissionRate: String(defaultCommissionRate),
      };
    }
    return initial;
  });

  // Reset rates when devs change
  if (
    selectedDevs.length > 0 &&
    Object.keys(devRates).length !== selectedDevs.length
  ) {
    const initial: Record<
      string,
      { hourlyRate: string; commissionRate: string }
    > = {};
    for (const dev of selectedDevs) {
      initial[dev.id] = {
        hourlyRate:
          devRates[dev.id]?.hourlyRate ?? String(dev.hourlyRate ?? 0),
        commissionRate:
          devRates[dev.id]?.commissionRate ?? String(defaultCommissionRate),
      };
    }
    setDevRates(initial);
  }

  const days = Number(workingDaysPerMonth) || 22;
  const hours = Number(hoursPerDay) || 8;

  const handleSubmit = async () => {
    setSubmitting(true);
    const pitches: PitchPayload[] = selectedDevs.map((dev) => {
      const hourlyRate = Number(devRates[dev.id]?.hourlyRate) || 0;
      const monthlyRate = Math.round(hourlyRate * hours * days);
      const commissionRate = Number(devRates[dev.id]?.commissionRate) || defaultCommissionRate;
      return {
        developerId: dev.id,
        hourlyRate,
        monthlyRate,
        currency,
        commissionRate,
        workingDaysPerMonth: days,
        hoursPerDay: hours,
        coverNote: coverNote.trim() || undefined,
      };
    });

    await onSubmit(pitches);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Pitch {selectedDevs.length} Candidate
            {selectedDevs.length !== 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Set hourly rates, commission rates, and work schedule for the
            selected developers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Work Schedule */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Work Schedule
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pitch-working-days" className="text-xs">
                  Days / month
                </Label>
                <Input
                  id="pitch-working-days"
                  type="number"
                  min={1}
                  max={31}
                  value={workingDaysPerMonth}
                  onChange={(e) => setWorkingDaysPerMonth(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pitch-hours-day" className="text-xs">
                  Hours / day
                </Label>
                <Input
                  id="pitch-hours-day"
                  type="number"
                  min={1}
                  max={24}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              e.g. 22 days &times; 8h = 176h/mo (full-time), 22 &times; 4 =
              88h/mo (part-time)
            </p>
          </div>

          <Separator />

          {/* Developer Table */}
          <ScrollArea className="max-h-[320px]">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-background">
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b">
                  <th className="px-3 py-2 text-left">Developer</th>
                  <th className="px-3 py-2 text-right">Hourly Rate</th>
                  <th className="px-3 py-2 text-right">Monthly Rate</th>
                  <th className="px-3 py-2 text-right">Commission %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {selectedDevs.map((dev) => {
                  const hourly =
                    Number(devRates[dev.id]?.hourlyRate) || 0;
                  const monthly = Math.round(hourly * hours * days);
                  return (
                    <tr key={dev.id}>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            <AvatarImage
                              src={dev.profilePhotoPath ?? undefined}
                              alt={dev.fullName ?? ""}
                            />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(dev.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {dev.fullName ?? "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {dev.professionalTitle}
                            </p>
                            {dev.pricingType === "flat" && dev.pricingAmount != null && (
                              <p className="font-mono text-[10px] text-muted-foreground">
                                Price: {dev.pricingCurrency ?? "USD"} {dev.pricingAmount.toLocaleString()}
                              </p>
                            )}
                            {dev.pricingType === "percentage" && dev.pricingAmount != null && (
                              <p className="font-mono text-[10px] text-muted-foreground">
                                Price: {dev.pricingAmount}% of salary
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Input
                          type="number"
                          min={0}
                          value={devRates[dev.id]?.hourlyRate ?? ""}
                          onChange={(e) =>
                            setDevRates((prev) => ({
                              ...prev,
                              [dev.id]: {
                                ...prev[dev.id],
                                hourlyRate: e.target.value,
                              },
                            }))
                          }
                          className="ml-auto w-28 text-right font-mono"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground whitespace-nowrap">
                        {monthly.toLocaleString()}/mo
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={devRates[dev.id]?.commissionRate ?? ""}
                          onChange={(e) =>
                            setDevRates((prev) => ({
                              ...prev,
                              [dev.id]: {
                                ...prev[dev.id],
                                commissionRate: e.target.value,
                              },
                            }))
                          }
                          className="ml-auto w-20 text-right font-mono"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>

          <Separator />

          {/* Cover Note */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Cover Note (optional)
            </Label>
            <Textarea
              placeholder="Add a note about why these candidates are a good fit..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            disabled={submitting}
            className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
            onClick={handleSubmit}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Submit Pitch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AgencyPitchDialog };
