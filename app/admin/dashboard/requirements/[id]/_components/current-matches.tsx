"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CalendarDays, Clock, MapPin, Pencil, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import type { ProposedMatch } from "@/lib/api/companies";
import { updateMatch } from "@/lib/api/companies";
import {
  matchStatusBadgeClass,
  matchStatusLabel,
  getInitials,
} from "../../../_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/lib/data/currencies";

// Matches in a terminal state can't have their rate/schedule re-negotiated.
const TERMINAL_STATUSES = new Set(["rejected", "declined", "ended"]);

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

const fmtWhole = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const CurrentMatches = ({
  matches,
  onRemove,
  onUpdate,
}: {
  matches: ProposedMatch[];
  onRemove: (matchId: string) => void;
  onUpdate?: () => void;
}) => {
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

function MatchCard({
  match,
  onRemove,
  onUpdate,
}: {
  match: ProposedMatch;
  onRemove: (matchId: string) => void;
  onUpdate?: () => void;
}) {
  const { getToken } = useAuth();
  // Derive hours/days from rate data when DB columns are null
  const derivedDays = match.workingDaysPerMonth ?? 22;
  const derivedHours = match.hoursPerDay ??
    (match.proposedHourlyRate > 0
      ? Math.round(match.proposedMonthlyRate / match.proposedHourlyRate / derivedDays)
      : 8);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canEdit = !TERMINAL_STATUSES.has(match.status);
  const [hourlyRate, setHourlyRate] = useState(String(match.proposedHourlyRate));
  const [hoursPerDay, setHoursPerDay] = useState(String(derivedHours));
  const [daysPerMonth, setDaysPerMonth] = useState(String(derivedDays));
  const [currency, setCurrency] = useState(match.currency);

  const hours = Number(hoursPerDay) || 8;
  const days = Number(daysPerMonth) || 22;
  const rate = Number(hourlyRate) || 0;
  const computedMonthly = Math.round(rate * hours * days);

  const handleSave = async () => {
    setSaving(true);
    const token = await getToken();
    const result = await updateMatch(token, match.id, {
      hourlyRate: rate,
      monthlyRate: computedMonthly,
      hoursPerDay: hours,
      workingDaysPerMonth: days,
      currency,
    });
    if (result) {
      toast.success("Match updated");
      setEditing(false);
      onUpdate?.();
    } else {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  const displayHours = derivedHours;
  const displayDays = derivedDays;

  return (
    <div className="rounded-lg border border-border/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={match.developer.avatar}
              alt={match.developer.name}
            />
            <AvatarFallback>
              {getInitials(match.developer.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/dashboard/applicants/${match.developerId}`}
                className="text-sm font-semibold hover:underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                {match.developer.name}
              </Link>
              <Badge
                variant="outline"
                className={matchStatusBadgeClass(match.status)}
              >
                {matchStatusLabel[match.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {match.developer.role}
            </p>

            {/* Skill badges */}
            <div className="flex flex-wrap gap-1">
              {(match.developer.skills ?? []).slice(0, 3).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {(match.developer.skills ?? []).length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{match.developer.skills.length - 3}
                </Badge>
              )}
            </div>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3" />
                {match.developer.location}
              </span>
              <span>{match.developer.yearsOfExperience}y exp</span>
            </div>

            {/* Rate + schedule */}
            {!editing ? (
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-mono font-semibold">
                    {fmt(match.proposedHourlyRate, match.currency)}/hr
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {fmtWhole(match.proposedMonthlyRate, match.currency)}/mo
                  </span>
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {displayHours}h/day
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    {displayDays} days/mo
                  </span>
                  <span className="font-mono">
                    = {displayHours * displayDays}h/mo
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Pencil className="size-3" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Currency</p>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="h-8 w-[88px] font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} {c.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rate/hr</p>
                    <Input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="h-8 w-20 font-mono text-xs"
                      min={0}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hrs/day</p>
                    <Input
                      type="number"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                      className="h-8 w-16 font-mono text-xs"
                      min={1}
                      max={24}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Days/mo</p>
                    <Input
                      type="number"
                      value={daysPerMonth}
                      onChange={(e) => setDaysPerMonth(e.target.value)}
                      className="h-8 w-16 font-mono text-xs"
                      min={1}
                      max={31}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly</p>
                    <p className="flex h-8 items-center font-mono text-xs font-semibold">
                      {fmtWhole(computedMonthly, currency)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-7 rounded-full px-3 text-xs"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="mr-1 size-3" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setEditing(false);
                      setHourlyRate(String(match.proposedHourlyRate));
                      setHoursPerDay(String(derivedHours));
                      setDaysPerMonth(String(derivedDays));
                      setCurrency(match.currency);
                    }}
                  >
                    <X className="mr-1 size-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {match.status === "rejected" && match.rejectionReason && (
              <p className="text-xs text-red-600">
                Rejected: {match.rejectionReason}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-red-600"
          onClick={() => setConfirmDelete(true)}
          title="Remove match"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this match?</DialogTitle>
            <DialogDescription>
              This removes <strong>{match.developer.name}</strong> (
              {matchStatusLabel[match.status]}) from this requirement. This
              can&apos;t be undone.
              {(match.status === "active" || match.status === "accepted") && (
                <>
                  {" "}
                  Any engagement already created from this match is not deleted
                  and must be ended separately.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                onRemove(match.id);
              }}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { CurrentMatches };
