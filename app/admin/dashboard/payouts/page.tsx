import { auth } from "@clerk/nextjs/server";

import { fetchPayouts, fetchPayoutSummary } from "@/lib/api/payouts";
import { PayoutsClient } from "./_components/payouts-client";

export default async function PayoutsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [payouts, summary] = await Promise.all([
    fetchPayouts(token),
    fetchPayoutSummary(token),
  ]);

  return (
    <PayoutsClient
      payouts={payouts ?? []}
      summary={summary ?? { totalPayouts: 0, totalPaidOut: 0, totalPending: 0, totalBilledToCompanies: 0, totalMargin: 0, averageMarginPercent: 0 }}
      token={token!}
    />
  );
}
