import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchCompanyProfile, fetchCompanyShortlist } from "@/lib/api/companies";
import { SavedConsole } from "./_components/saved-console";

export default async function SavedPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const profile = await fetchCompanyProfile(token);
  if (profile && profile.marketplaceEnabled === false) {
    redirect("/companies/dashboard/requirements");
  }

  const developers = await fetchCompanyShortlist(token);

  return <SavedConsole developers={developers} />;
}
