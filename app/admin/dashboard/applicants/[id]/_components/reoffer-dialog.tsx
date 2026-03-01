"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";

import { reofferApplication } from "@/lib/api/admin";
import { formatCurrency } from "../../../_components/dashboard-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "CAD", "AUD", "ZAR"] as const;
const ENGAGEMENT_TYPES = ["hourly", "part-time", "full-time"] as const;

interface ReofferDialogProps {
  applicationId: string;
  previousCurrency: string;
  previousEngagementType: string;
}

export function ReofferDialog({
  applicationId,
  previousCurrency,
  previousEngagementType,
}: ReofferDialogProps) {
  const router = useRouter();
  const { getToken } = useAuth();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currency, setCurrency] = useState(previousCurrency || "USD");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerMonth, setHoursPerMonth] = useState("");
  const [engagementType, setEngagementType] = useState(previousEngagementType || "hourly");
  const [startDate, setStartDate] = useState("");
  const [note, setNote] = useState("");

  const monthlyRate = useMemo(() => {
    const h = parseFloat(hourlyRate);
    const hrs = parseFloat(hoursPerMonth);
    if (!Number.isFinite(h) || !Number.isFinite(hrs) || h <= 0 || hrs <= 0)
      return null;
    return h * hrs;
  }, [hourlyRate, hoursPerMonth]);

  const isValid =
    parseFloat(hourlyRate) > 0 &&
    parseFloat(hoursPerMonth) > 0 &&
    currency &&
    engagementType &&
    startDate;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const hourlyRateCents = Math.round(parseFloat(hourlyRate) * 100);
      const monthlyRateCents = Math.round((monthlyRate ?? 0) * 100);

      await reofferApplication(token, applicationId, {
        hourlyRateCents,
        monthlyRateCents,
        currency,
        engagementType,
        startDate,
        note: note.trim() || undefined,
      });

      setOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setHourlyRate("");
    setHoursPerMonth("");
    setCurrency(previousCurrency || "USD");
    setEngagementType(previousEngagementType || "hourly");
    setStartDate("");
    setNote("");
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Re-offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Re-offer</DialogTitle>
          <DialogDescription>
            The previous offer was declined. Send a new offer with updated terms.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reoffer-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="reoffer-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reoffer-engagement">Engagement Type</Label>
              <Select value={engagementType} onValueChange={setEngagementType}>
                <SelectTrigger id="reoffer-engagement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENGAGEMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reoffer-hourly">Hourly Rate ({currency})</Label>
              <Input
                id="reoffer-hourly"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reoffer-hours">Hours / Month</Label>
              <Input
                id="reoffer-hours"
                type="number"
                min="0"
                step="1"
                placeholder="160"
                value={hoursPerMonth}
                onChange={(e) => setHoursPerMonth(e.target.value)}
              />
            </div>
          </div>

          {monthlyRate !== null && (
            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Calculated Monthly Rate
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(monthlyRate, currency)}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="reoffer-start">Start Date</Label>
            <Input
              id="reoffer-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reoffer-note">Note (optional)</Label>
            <Textarea
              id="reoffer-note"
              placeholder="Additional notes about this re-offer..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Sending..." : "Send Re-offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
