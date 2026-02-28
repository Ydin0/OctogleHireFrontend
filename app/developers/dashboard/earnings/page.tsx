import { auth } from "@clerk/nextjs/server";

import { fetchPayoutsByDeveloper, fetchDeveloperPayoutSummary } from "@/lib/api/payouts";
import { EarningsClient } from "./_components/earnings-client";

export default async function EarningsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  // In production this would resolve from the authenticated user's profile.
  // For now we default to the first mock developer so the page renders data.
  const developerId = "mei-lin-chen";

  const [payouts, summary] = await Promise.all([
    fetchPayoutsByDeveloper(token, developerId),
    fetchDeveloperPayoutSummary(token, developerId),
  ]);

  return (
    <EarningsClient
      payouts={payouts ?? []}
      summary={
        summary ?? {
          totalPayouts: 0,
          totalPaidOut: 0,
          totalPending: 0,
          totalBilledToCompanies: 0,
          totalMargin: 0,
          averageMarginPercent: 0,
        }
      }
    />
  );
}
