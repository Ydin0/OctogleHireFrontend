import { auth } from "@clerk/nextjs/server";

import {
  fetchAgencyCommissions,
  fetchAgencyCommissionSummary,
} from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (cents: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);

const statusBadge: Record<string, string> = {
  pending: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  accruing: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  paid: "border-emerald-600/20 bg-emerald-500/10 text-emerald-600",
  cancelled: "border-red-600/20 bg-red-500/10 text-red-600",
};

export default async function AgencyCommissionsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [commissions, summary] = await Promise.all([
    fetchAgencyCommissions(token),
    fetchAgencyCommissionSummary(token),
  ]);

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Commissions</h1>
        <p className="text-sm text-muted-foreground">
          Track your earnings from placed candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold">
              {formatCurrency(summary?.totalEarnedCents ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Paid Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold text-emerald-600">
              {formatCurrency(summary?.totalPaidCents ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold text-amber-600">
              {formatCurrency(summary?.totalPendingCents ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {!commissions || commissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No commission records yet. Commissions are created when your candidates get placed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 pr-4 text-left font-medium">Developer</th>
                    <th className="pb-2 pr-4 text-left font-medium">Company</th>
                    <th className="pb-2 pr-4 text-right font-medium">Rate</th>
                    <th className="pb-2 pr-4 text-right font-medium">Earned</th>
                    <th className="pb-2 pr-4 text-right font-medium">Paid</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissions.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 pr-4">{c.developerName ?? "-"}</td>
                      <td className="py-3 pr-4">{c.companyName ?? "-"}</td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {c.commissionRate}%
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {formatCurrency(c.totalEarnedCents, c.currency)}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">
                        {formatCurrency(c.paidAmountCents, c.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant="outline"
                          className={statusBadge[c.status] ?? statusBadge.pending}
                        >
                          {c.status}
                        </Badge>
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
