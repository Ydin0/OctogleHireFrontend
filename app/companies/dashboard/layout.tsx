import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "./_components/dashboard-shell";
import { resolveDashboardPath } from "@/lib/auth/account-type";

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
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();
  const destination = resolveDashboardPath({ user, orgId });

  if (destination !== "/companies/dashboard") {
    redirect(destination);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
