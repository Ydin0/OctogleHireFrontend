import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OverviewClient } from "./_components/overview-client";
import {
  fetchDeveloperOpportunities,
  fetchDeveloperEngagements,
  fetchDeveloperEarnings,
  fetchDeveloperEarningsSummary,
  fetchDeveloperTimeEntries,
} from "@/lib/api/developer";

export default async function OverviewPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();

  const [opportunities, engagements, payouts, summary, timeEntries] =
    await Promise.all([
      fetchDeveloperOpportunities(token),
      fetchDeveloperEngagements(token),
      fetchDeveloperEarnings(token),
      fetchDeveloperEarningsSummary(token),
      fetchDeveloperTimeEntries(token),
    ]);

  return (
    <OverviewClient
      opportunities={opportunities ?? []}
      engagements={engagements ?? []}
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
      timeEntries={timeEntries ?? []}
    />
  );
}
