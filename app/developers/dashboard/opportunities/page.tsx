import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OpportunitiesClient } from "./_components/opportunities-client";
import { fetchDeveloperOpportunities } from "@/lib/api/developer";

export default async function OpportunitiesPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();
  const opportunities = await fetchDeveloperOpportunities(token);

  return <OpportunitiesClient opportunities={opportunities ?? []} />;
}
