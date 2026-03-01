"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type ApplicationStatus,
  ALL_STATUSES,
  applicationStatusLabel,
  formatCurrency,
} from "../../../_components/dashboard-data";

const CURRENCIES = ["USD", "GBP", "EUR", "AED", "CAD", "AUD", "ZAR"] as const;
const ENGAGEMENT_TYPES = ["hourly", "part-time", "full-time"] as const;

interface StatusChangerProps {
  applicationId: string;
  currentStatus: string;
  token: string;
}

function StatusChanger({
  applicationId,
  currentStatus,
  token,
}: StatusChangerProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Offer fields
  const [currency, setCurrency] = useState("USD");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerMonth, setHoursPerMonth] = useState("");
  const [engagementType, setEngagementType] = useState("hourly");
  const [startDate, setStartDate] = useState("");

  const isOfferFlow = selectedStatus === "offer_extended";

  const monthlyRate = useMemo(() => {
    const h = parseFloat(hourlyRate);
    const hrs = parseFloat(hoursPerMonth);
    if (!Number.isFinite(h) || !Number.isFinite(hrs) || h <= 0 || hrs <= 0)
      return null;
    return h * hrs;
  }, [hourlyRate, hoursPerMonth]);

  const offerValid =
    parseFloat(hourlyRate) > 0 &&
    parseFloat(hoursPerMonth) > 0 &&
    currency &&
    engagementType &&
    startDate;

  const handleStatusSelect = (value: string) => {
    if (value !== currentStatus) {
      setSelectedStatus(value);
      setError(null);
      setDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    try {
      if (isOfferFlow) {
        // Send offer via dedicated endpoint
        const hourlyRateCents = Math.round(parseFloat(hourlyRate) * 100);
        const monthlyRateCents = Math.round((monthlyRate ?? 0) * 100);

        const response = await fetch(
          `${apiBaseUrl}/api/admin/applications/${applicationId}/offer`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hourlyRateCents,
              monthlyRateCents,
              currency,
              engagementType,
              startDate,
              note: note.trim() || undefined,
            }),
          }
        );

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(payload?.message ?? "Failed to extend offer");
        }
      } else {
        // Regular status change
        const response = await fetch(
          `${apiBaseUrl}/api/admin/applications/${applicationId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: selectedStatus,
              note: note.trim() || undefined,
            }),
          }
        );

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(payload?.message ?? "Failed to update status");
        }
      }

      setDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNote("");
    setHourlyRate("");
    setHoursPerMonth("");
    setCurrency("USD");
    setEngagementType("hourly");
    setStartDate("");
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedStatus(currentStatus);
    resetForm();
  };

  return (
    <div id="status">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        Pipeline Status
      </p>
      <Select value={currentStatus} onValueChange={handleStatusSelect}>
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALL_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {applicationStatusLabel[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className={isOfferFlow ? "sm:max-w-lg" : undefined}>
          <DialogHeader>
            <DialogTitle>
              {isOfferFlow ? "Extend Offer" : "Change Application Status"}
            </DialogTitle>
            <DialogDescription>
              Moving from{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[currentStatus as ApplicationStatus]}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {applicationStatusLabel[selectedStatus as ApplicationStatus]}
              </span>
            </DialogDescription>
          </DialogHeader>

          {isOfferFlow ? (
            <div className="space-y-4">
              {/* Currency + Engagement Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="offer-currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="offer-currency">
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
                  <Label htmlFor="offer-engagement">Engagement Type</Label>
                  <Select value={engagementType} onValueChange={setEngagementType}>
                    <SelectTrigger id="offer-engagement">
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

              {/* Hourly Rate + Hours/Month */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="offer-hourly">Hourly Rate ({currency})</Label>
                  <Input
                    id="offer-hourly"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-hours">Hours / Month</Label>
                  <Input
                    id="offer-hours"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="160"
                    value={hoursPerMonth}
                    onChange={(e) => setHoursPerMonth(e.target.value)}
                  />
                </div>
              </div>

              {/* Monthly Rate (calculated) */}
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

              {/* Start Date */}
              <div className="space-y-1.5">
                <Label htmlFor="offer-start">Start Date</Label>
                <Input
                  id="offer-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Optional note */}
              <div className="space-y-1.5">
                <Label htmlFor="offer-note">Note (optional)</Label>
                <Textarea
                  id="offer-note"
                  placeholder="Additional notes about this offer..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Add an optional note for this status change:
              </p>
              <Textarea
                placeholder="Reason for status change..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading || (isOfferFlow && !offerValid)}
            >
              {isLoading
                ? isOfferFlow
                  ? "Extending..."
                  : "Updating..."
                : isOfferFlow
                  ? "Extend Offer"
                  : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { StatusChanger };
