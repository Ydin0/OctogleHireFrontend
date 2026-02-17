import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "./_components/dashboard-shell";
import { PendingDashboard } from "./_components/pending-dashboard";
import { resolveDashboardPath } from "@/lib/auth/account-type";
import {
  buildDefaultTimeline,
  fetchDeveloperApplicationStatus,
} from "@/lib/developer-application";

export const metadata: Metadata = {
  title: "Developer Dashboard | OctogleHire",
  description:
    "Manage application status, profile, engagements, and earnings from your developer dashboard.",
};

export default async function DeveloperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId, getToken } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();
  const destination = resolveDashboardPath({ user, orgId });

  if (destination !== "/developers/dashboard") {
    redirect(destination);
  }

  const token = await getToken();
  const applicationStatus = await fetchDeveloperApplicationStatus(token);
  const isApproved = applicationStatus?.approved ?? false;

  if (!isApproved) {
    return (
      <PendingDashboard
        displayName={user?.firstName ?? user?.username ?? "Developer"}
        avatarUrl={user?.imageUrl ?? null}
        status={applicationStatus?.status ?? "hr_communication_round"}
        timeline={applicationStatus?.timeline ?? buildDefaultTimeline()}
      />
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
