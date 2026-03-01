import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OverviewClient } from "./_components/overview-client";
import { fetchDeveloperProfile, fetchDeveloperOffers, fetchDeveloperOpportunities } from "@/lib/api/developer";
import { fetchDeveloperApplicationStatus } from "@/lib/developer-application";

export default async function OverviewPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();

  const [profile, offers, opportunities, applicationStatus] = await Promise.all([
    fetchDeveloperProfile(token),
    fetchDeveloperOffers(token),
    fetchDeveloperOpportunities(token),
    fetchDeveloperApplicationStatus(token),
  ]);

  return (
    <OverviewClient
      profile={profile}
      offers={offers ?? []}
      opportunities={opportunities ?? []}
      applicationStatus={applicationStatus}
    />
  );
}
