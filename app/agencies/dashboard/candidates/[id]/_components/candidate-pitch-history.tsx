"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import {
  fetchCandidatePitchHistory,
  type CandidatePitchHistory as PitchHistoryItem,
} from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-amber-500/10 text-amber-600 border-amber-600/20";
  }
};

interface CandidatePitchHistoryProps {
  candidateId: string;
}

const CandidatePitchHistoryCard = ({
  candidateId,
}: CandidatePitchHistoryProps) => {
  const { getToken } = useAuth();
  const [pitches, setPitches] = useState<PitchHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const data = await fetchCandidatePitchHistory(token, candidateId);
      if (!cancelled) {
        setPitches(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [candidateId, getToken]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pitch History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!pitches || pitches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pitch History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No pitches yet for this candidate.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pitch History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {pitches.map((pitch) => (
            <div key={pitch.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">
                  {pitch.requirementTitle}
                </p>
                <Badge
                  variant="outline"
                  className={statusBadgeClass(pitch.status)}
                >
                  {pitch.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {pitch.companyName && <span>{pitch.companyName}</span>}
                <span className="font-mono">
                  ${pitch.pitchedHourlyRate}/hr
                </span>
                <span>
                  {new Date(pitch.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { CandidatePitchHistoryCard };
