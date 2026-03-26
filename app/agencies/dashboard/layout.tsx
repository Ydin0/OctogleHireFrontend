import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AgencySidebar } from "./_components/agency-sidebar";
import { AgencyHeader } from "./_components/agency-header";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { fetchAgencyProfile } from "@/lib/api/agencies";

export const metadata: Metadata = {
  title: "Agency Dashboard | OctogleHire",
  description:
    "Manage candidates, commissions, and referral links from your agency dashboard.",
};

export default async function AgencyDashboardLayout({
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

  if (!roles.includes("agency")) {
    const destination = resolveDashboardPathFromRole(accountType, orgId);
    if (destination !== "/agencies/dashboard") {
      redirect(destination);
    }
  }

  const [clerkUser, agencyProfile] = await Promise.all([
    currentUser(),
    fetchAgencyProfile(token),
  ]);

  const user = {
    fullName: clerkUser
      ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null
      : null,
    email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
    imageUrl: clerkUser?.imageUrl ?? null,
  };

  const agencyName = agencyProfile?.name ?? "Agency";

  const sidebarProps = {
    user,
    agencyName,
    roles,
    activeRole: accountType ?? "agency",
  };

  return (
    <div className="min-h-screen bg-background">
      <AgencySidebar {...sidebarProps} />
      <AgencyHeader {...sidebarProps} />
      <main className="lg:ml-64">
        <div className="space-y-6 px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
