"use client";

import { MapPin } from "lucide-react";

import type { AgencyPitch } from "@/lib/api/agencies";
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

const getInitials = (name: string | null) =>
  name
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

const AgencyCurrentPitches = ({ pitches }: { pitches: AgencyPitch[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Your Pitches ({pitches.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pitches.map((pitch) => (
            <div
              key={pitch.id}
              className="rounded-lg border border-border/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={pitch.developer.avatar ?? undefined}
                      alt={pitch.developer.name ?? ""}
                    />
                    <AvatarFallback>
                      {getInitials(pitch.developer.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {pitch.developer.name ?? "Unknown"}
                      </p>
                      <Badge
                        variant="outline"
                        className={statusBadge[pitch.status] ?? statusBadge.pending}
                      >
                        {pitch.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pitch.developer.title}
                    </p>

                    {pitch.developer.skills && pitch.developer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pitch.developer.skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {pitch.developer.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pitch.developer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {pitch.developer.location && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-3" />
                          {pitch.developer.location}
                        </span>
                        {pitch.developer.yearsOfExperience != null && (
                          <span>{pitch.developer.yearsOfExperience}y exp</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono font-semibold">
                        ${pitch.pitchedHourlyRate}/hr
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        ${pitch.pitchedMonthlyRate.toLocaleString()}/mo
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {pitch.pitchedCommissionRate}% commission
                      </span>
                    </div>

                    {pitch.status === "rejected" && pitch.rejectionReason && (
                      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-red-600 mb-0.5">
                          Rejection Feedback
                        </p>
                        <p className="text-xs text-red-700">{pitch.rejectionReason}</p>
                      </div>
                    )}

                    {pitch.coverNote && (
                      <p className="text-xs text-muted-foreground italic">
                        {pitch.coverNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { AgencyCurrentPitches };
