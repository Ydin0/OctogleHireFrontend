import { auth } from "@clerk/nextjs/server";

import {
  fetchDeveloperEarnings,
  fetchDeveloperEarningsSummary,
} from "@/lib/api/developer";
import { EarningsClient } from "./_components/earnings-client";

export default async function EarningsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [payouts, summary] = await Promise.all([
    fetchDeveloperEarnings(token),
    fetchDeveloperEarningsSummary(token),
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
