import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { OffersClient } from "./_components/offers-client";
import { fetchDeveloperOffers } from "@/lib/api/developer";

export default async function OffersPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();
  const offers = await fetchDeveloperOffers(token);

  return <OffersClient offers={offers ?? []} />;
}
