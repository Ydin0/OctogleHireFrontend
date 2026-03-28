import { auth } from "@clerk/nextjs/server";

import { fetchCompanyProfile, fetchOnboardingTemplate } from "@/lib/api/companies";
import { CompanySettingsForm } from "./_components/company-settings-form";
import { OnboardingTemplateSettings } from "./_components/onboarding-template-settings";

export default async function CompanySettingsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [profile, templateData] = await Promise.all([
    fetchCompanyProfile(token),
    fetchOnboardingTemplate(token),
  ]);

  return (
    <div className="space-y-8">
      <CompanySettingsForm profile={profile} />
      <OnboardingTemplateSettings initialItems={templateData?.items ?? []} />
    </div>
  );
}
