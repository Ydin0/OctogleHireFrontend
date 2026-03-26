import { auth } from "@clerk/nextjs/server";
import { Users } from "lucide-react";

import {
  fetchAgencyMe,
  fetchAgencyStats,
  fetchAgencyCommissionSummary,
  fetchUnifiedCandidates,
  fetchAgencyTeam,
} from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default async function AgencyDashboardPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const me = await fetchAgencyMe(token);
  const isAdmin = me?.role === "admin";
  const scope = isAdmin ? undefined : ("mine" as const);

  const [stats, commissionSummary, candidatesResult, teamMembers] =
    await Promise.all([
      fetchAgencyStats(token, scope),
      fetchAgencyCommissionSummary(token),
      fetchUnifiedCandidates(token, { limit: 1000 }),
      isAdmin ? fetchAgencyTeam(token) : Promise.resolve(null),
    ]);

  // Compute candidates per sourcer (admin only)
  const candidates = candidatesResult?.candidates ?? [];
  const sourcerCounts = new Map<string, { name: string; count: number }>();

  if (isAdmin) {
    for (const c of candidates) {
      const userId = c.sourcedByUserId;
      const name = c.sourcedByName;
      if (userId && name) {
        const existing = sourcerCounts.get(userId);
        if (existing) {
          existing.count++;
        } else {
          sourcerCounts.set(userId, { name, count: 1 });
        }
      }
    }
  }

  const sourcerLeaderboard = [...sourcerCounts.entries()]
    .map(([userId, { name, count }]) => {
      const member = (teamMembers ?? []).find((m) => m.userId === userId);
      return { userId, name, count, avatar: member?.avatar ?? null };
    })
    .sort((a, b) => b.count - a.count);

  const unattributedCount = candidates.filter(
    (c) => !c.sourcedByUserId
  ).length;

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Your agency performance at a glance."
            : "Your personal performance at a glance."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Candidates Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold">
              {stats?.candidatesSubmitted ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Candidates Placed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold">
              {stats?.candidatesPlaced ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold">
              {stats?.conversionRate ?? 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold">
              {formatCurrency(commissionSummary?.totalEarnedCents ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg font-semibold text-emerald-600">
              {formatCurrency(commissionSummary?.totalPaidCents ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg font-semibold text-amber-600">
              {formatCurrency(commissionSummary?.totalPendingCents ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg font-semibold">
              {commissionSummary?.totalCommissions ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Candidates by Sourcer — admin only */}
      {isAdmin && (sourcerLeaderboard.length > 0 || unattributedCount > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Candidates by Sourcer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sourcerLeaderboard.length > 0 ? (
              <div className="divide-y divide-border">
                {sourcerLeaderboard.map((s) => (
                  <div
                    key={s.userId}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-7">
                        {s.avatar && (
                          <AvatarImage src={s.avatar} alt={s.name} />
                        )}
                        <AvatarFallback className="text-[10px]">
                          {getInitials(s.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <span className="font-mono text-sm">{s.count}</span>
                  </div>
                ))}
                {unattributedCount > 0 && (
                  <div className="flex items-center justify-between py-2.5 text-muted-foreground">
                    <span className="text-sm">Unattributed</span>
                    <span className="font-mono text-sm">
                      {unattributedCount}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {unattributedCount} candidate{unattributedCount !== 1 ? "s" : ""} with no sourcer assigned yet.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
