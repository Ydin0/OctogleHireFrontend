import { auth } from "@clerk/nextjs/server";

import { fetchCompanyProfile } from "@/lib/api/companies";
import { CompanySettingsForm } from "./_components/company-settings-form";

export default async function CompanySettingsPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const profile = await fetchCompanyProfile(token);

  return <CompanySettingsForm profile={profile} />;
}
