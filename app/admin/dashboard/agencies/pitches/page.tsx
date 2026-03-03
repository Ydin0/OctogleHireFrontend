"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Check, MapPin, X } from "lucide-react";

import {
  fetchAdminAgencyPitches,
  reviewAdminAgencyPitch,
  type AdminAgencyPitch,
} from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  approved: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  rejected: "border-red-600/20 bg-red-500/10 text-red-600",
};

const tabs = [
  { label: "Pending", value: "pending" },
  { label: "All", value: "" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

const getInitials = (name: string | null) =>
  name
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

export default function AdminAgencyPitchesPage() {
  const { getToken } = useAuth();
  const [pitches, setPitches] = useState<AdminAgencyPitch[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  const loadPitches = useCallback(
    async (status: string) => {
      setLoading(true);
      const token = await getToken();
      const data = await fetchAdminAgencyPitches(token, {
        status: status || undefined,
      });
      setPitches(data ?? []);
      setLoading(false);
    },
    [getToken]
  );

  useEffect(() => {
    loadPitches(activeTab);
  }, [activeTab, loadPitches]);

  const handleReview = async (
    pitchId: string,
    action: "approve" | "reject"
  ) => {
    setProcessing((prev) => new Set(prev).add(pitchId));
    const token = await getToken();
    await reviewAdminAgencyPitch(token, pitchId, {
      action,
      adminNote: adminNotes[pitchId] || undefined,
    });
    setProcessing((prev) => {
      const next = new Set(prev);
      next.delete(pitchId);
      return next;
    });
    loadPitches(activeTab);
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Agency Pitches</h1>
        <p className="text-sm text-muted-foreground">
          Review candidate pitches submitted by agencies.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === tab.value
                ? "border-pulse/35 bg-pulse/10 text-foreground"
                : "border-transparent hover:border-pulse/25 hover:bg-pulse/5 text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Loading pitches...</p>
          </CardContent>
        </Card>
      ) : pitches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No {activeTab || ""} pitches found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pitches.map((pitch) => {
            const isProcessing = processing.has(pitch.id);
            return (
              <Card key={pitch.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Developer info */}
                    <Avatar className="size-12 shrink-0">
                      <AvatarImage
                        src={pitch.developer.avatar ?? undefined}
                        alt={pitch.developer.name ?? ""}
                      />
                      <AvatarFallback>
                        {getInitials(pitch.developer.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                      {/* Header row */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              {pitch.developer.name ?? "Unknown"}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                statusBadge[pitch.status] ??
                                statusBadge.pending
                              }
                            >
                              {pitch.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {pitch.developer.title}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {pitch.agencyName}
                        </Badge>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Requirement
                          </p>
                          <p className="font-medium truncate">
                            {pitch.requirementTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pitch.companyName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Hourly Rate
                          </p>
                          <p className="font-mono font-medium">
                            ${pitch.pitchedHourlyRate}/hr
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Monthly Rate
                          </p>
                          <p className="font-mono font-medium">
                            ${pitch.pitchedMonthlyRate.toLocaleString()}/mo
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Commission
                          </p>
                          <p className="font-mono font-medium">
                            {pitch.pitchedCommissionRate}%
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      {pitch.developer.skills &&
                        pitch.developer.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {pitch.developer.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-[10px]"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {pitch.developer.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="size-3" />
                            {pitch.developer.location}
                          </span>
                        )}
                        {pitch.developer.yearsOfExperience != null && (
                          <span>
                            {pitch.developer.yearsOfExperience}y exp
                          </span>
                        )}
                        <span>
                          {pitch.workingDaysPerMonth}d/mo &times;{" "}
                          {pitch.hoursPerDay}h/day
                        </span>
                        <span>
                          Pitched{" "}
                          {new Date(pitch.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Cover note */}
                      {pitch.coverNote && (
                        <div className="rounded-md bg-muted/50 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                            Cover Note
                          </p>
                          <p className="text-sm">{pitch.coverNote}</p>
                        </div>
                      )}

                      {/* Admin note (for already reviewed) */}
                      {pitch.adminNote && pitch.status !== "pending" && (
                        <p className="text-xs text-muted-foreground">
                          Admin note: {pitch.adminNote}
                        </p>
                      )}

                      {/* Actions for pending */}
                      {pitch.status === "pending" && (
                        <div className="flex items-end gap-3 pt-1">
                          <div className="flex-1 space-y-1">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              Admin Note (optional)
                            </Label>
                            <Input
                              placeholder="Add a note..."
                              value={adminNotes[pitch.id] ?? ""}
                              onChange={(e) =>
                                setAdminNotes((prev) => ({
                                  ...prev,
                                  [pitch.id]: e.target.value,
                                }))
                              }
                              className="h-8 text-sm"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            disabled={isProcessing}
                            onClick={() => handleReview(pitch.id, "reject")}
                          >
                            <X className="size-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                            disabled={isProcessing}
                            onClick={() => handleReview(pitch.id, "approve")}
                          >
                            <Check className="size-3.5" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
