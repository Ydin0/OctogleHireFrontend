import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CompanySidebar } from "./_components/company-sidebar";
import { CompanyHeader } from "./_components/company-header";
import { ChatWidget } from "./_components/chat-widget";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { fetchCompanyProfile, fetchCompanyTeam } from "@/lib/api/companies";

export const metadata: Metadata = {
  title: "Company Dashboard | OctogleHire",
  description:
    "Manage offshore teams, invoices, and delivery resources from your company dashboard.",
};

export default async function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const token = await getToken();
  const { accountType, orgId, roles } = await fetchUserRole(token);

  if (!roles.includes("company")) {
    const destination = resolveDashboardPathFromRole(accountType, orgId);
    if (destination !== "/companies/dashboard") {
      redirect(destination);
    }
  }

  const clerkUser = await currentUser();
  const [companyProfile, teamMembers] = await Promise.all([
    fetchCompanyProfile(token),
    fetchCompanyTeam(token),
  ]);

  const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  // Prefer team member avatar (uploaded via team page) over Clerk default
  const teamMemberAvatar = userEmail
    ? teamMembers?.find(
        (m) => m.email.toLowerCase() === userEmail.toLowerCase(),
      )?.avatar
    : null;

  const user = {
    fullName: clerkUser
      ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        null
      : null,
    email: userEmail,
    imageUrl: teamMemberAvatar || clerkUser?.imageUrl || null,
  };

  return (
    <div className="min-h-screen bg-background">
      <CompanySidebar user={user} companyProfile={companyProfile} roles={roles} activeRole={accountType ?? "company"} />
      <CompanyHeader user={user} companyProfile={companyProfile} roles={roles} activeRole={accountType ?? "company"} />
      <main className="lg:ml-64">
        <div className="space-y-6 px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
      <ChatWidget
        accountManagerId={companyProfile?.accountManagerId ?? undefined}
        accountManagerName={companyProfile?.accountManager?.name}
        accountManagerAvatar={companyProfile?.accountManager?.profilePhotoUrl}
      />
    </div>
  );
}
