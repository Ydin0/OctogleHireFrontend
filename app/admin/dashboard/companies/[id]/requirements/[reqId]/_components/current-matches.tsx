"use client";

import { MapPin, Star, Trash2 } from "lucide-react";

import type { ProposedMatch } from "@/lib/api/companies";
import {
  matchStatusBadgeClass,
  matchStatusLabel,
  getInitials,
} from "../../../../../_components/dashboard-data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CurrentMatches = ({
  matches,
  onRemove,
}: {
  matches: ProposedMatch[];
  onRemove: (matchId: string) => void;
}) => {
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="rounded-lg border border-border/70 p-4"
        >
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
                  <p className="text-sm font-semibold">
                    {match.developer.name}
                  </p>
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
                  {match.developer.skills.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {match.developer.skills.length > 3 && (
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
                  <span className="flex items-center gap-0.5">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {match.developer.rating}
                  </span>
                  <span>{match.developer.yearsOfExperience}y exp</span>
                </div>

                {/* Rate */}
                <p className="text-sm">
                  <span className="font-mono font-semibold">
                    ${match.proposedHourlyRate}/hr
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    ${match.proposedMonthlyRate.toLocaleString()}/mo
                  </span>
                </p>

                {match.status === "rejected" && match.rejectionReason && (
                  <p className="text-xs text-red-600">
                    Rejected: {match.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            {match.status === "proposed" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-red-600"
                onClick={() => onRemove(match.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export { CurrentMatches };
