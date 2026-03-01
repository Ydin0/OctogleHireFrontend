import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardShell } from "./_components/dashboard-shell";
import { DeveloperProfileProvider } from "./_components/developer-profile-context";
import { PendingDashboard } from "./_components/pending-dashboard";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { fetchDeveloperProfile, fetchDeveloperOffers } from "@/lib/api/developer";
import type { DeveloperOffer } from "@/lib/api/developer";
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
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const token = await getToken();
  const { accountType, orgId } = await fetchUserRole(token);
  const destination = resolveDashboardPathFromRole(accountType, orgId);

  if (destination !== "/developers/dashboard") {
    redirect(destination);
  }

  const applicationStatus = await fetchDeveloperApplicationStatus(token);
  const isApproved = applicationStatus?.approved ?? false;

  if (!isApproved) {
    const user = await currentUser();
    const status = applicationStatus?.status ?? "hr_communication_round";

    // If offer_extended, fetch offers so developer can accept/decline
    let offers: DeveloperOffer[] = [];
    if (status === "offer_extended") {
      offers = (await fetchDeveloperOffers(token)) ?? [];
    }

    return (
      <PendingDashboard
        displayName={user?.firstName ?? user?.username ?? "Developer"}
        avatarUrl={user?.imageUrl ?? null}
        status={status}
        timeline={applicationStatus?.timeline ?? buildDefaultTimeline()}
        offers={offers}
      />
    );
  }

  const profile = await fetchDeveloperProfile(token);

  if (!profile) {
    return (
      <DashboardShell token={token}>{children}</DashboardShell>
    );
  }

  return (
    <DeveloperProfileProvider profile={profile}>
      <DashboardShell token={token}>{children}</DashboardShell>
    </DeveloperProfileProvider>
  );
}
