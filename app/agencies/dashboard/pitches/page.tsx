"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { MapPin } from "lucide-react";

import { fetchAgencyPitches, type AgencyPitch } from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  approved: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  rejected: "border-red-600/20 bg-red-500/10 text-red-600",
};

const tabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
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

export default function AgencyPitchesPage() {
  const { getToken } = useAuth();
  const [pitches, setPitches] = useState<AgencyPitch[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPitches = useCallback(
    async (status: string) => {
      setLoading(true);
      const token = await getToken();
      const data = await fetchAgencyPitches(token, {
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

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">My Pitches</h1>
        <p className="text-sm text-muted-foreground">
          Track your candidate pitches across all requirements.
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
              No pitches found. Browse requirements and pitch your candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {pitches.length} pitch{pitches.length !== 1 ? "es" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4 text-left font-medium">
                      Developer
                    </th>
                    <th className="pb-2 pr-4 text-left font-medium">
                      Requirement
                    </th>
                    <th className="pb-2 pr-4 text-right font-medium">Rate</th>
                    <th className="pb-2 pr-4 text-right font-medium">
                      Commission
                    </th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pitches.map((pitch) => (
                    <tr key={pitch.id}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={pitch.developer.avatar ?? undefined}
                              alt={pitch.developer.name ?? ""}
                            />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(pitch.developer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {pitch.developer.name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {pitch.developer.title}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {pitch.requirementTitle}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {pitch.companyName}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-right whitespace-nowrap">
                        <span className="font-mono font-medium">
                          ${pitch.pitchedHourlyRate}/hr
                        </span>
                        <br />
                        <span className="font-mono text-xs text-muted-foreground">
                          ${pitch.pitchedMonthlyRate.toLocaleString()}/mo
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {pitch.pitchedCommissionRate}%
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant="outline"
                          className={
                            statusBadge[pitch.status] ?? statusBadge.pending
                          }
                        >
                          {pitch.status}
                        </Badge>
                        {pitch.status === "rejected" && pitch.adminNote && (
                          <p className="mt-1 text-[10px] text-red-600 text-right">
                            {pitch.adminNote}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
