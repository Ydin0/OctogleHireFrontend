import { auth } from "@clerk/nextjs/server";

import { fetchAgencyProfile } from "@/lib/api/agencies";
import { AgencySettingsForm } from "./_components/agency-settings-form";

export default async function AgencySettingsPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const profile = await fetchAgencyProfile(token);

  return <AgencySettingsForm profile={profile} />;
}
