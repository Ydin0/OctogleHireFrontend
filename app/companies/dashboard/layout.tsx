import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "./_components/dashboard-shell";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";

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
  const { accountType, orgId } = await fetchUserRole(token);
  const destination = resolveDashboardPathFromRole(accountType, orgId);

  if (destination !== "/companies/dashboard") {
    redirect(destination);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
