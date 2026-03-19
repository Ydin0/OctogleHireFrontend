import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AgencyDashboardShell } from "./_components/agency-dashboard-shell";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";

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

  return <AgencyDashboardShell roles={roles} activeRole={accountType ?? "agency"}>{children}</AgencyDashboardShell>;
}
