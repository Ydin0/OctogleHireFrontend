import { auth } from "@clerk/nextjs/server";

import {
  fetchAgencyStats,
  fetchAgencyCommissionSummary,
} from "@/lib/api/agencies";
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

export default async function AgencyDashboardPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [stats, commissionSummary] = await Promise.all([
    fetchAgencyStats(token),
    fetchAgencyCommissionSummary(token),
  ]);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your agency performance at a glance.
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
    </>
  );
}
