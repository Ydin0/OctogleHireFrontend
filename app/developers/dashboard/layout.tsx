import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DeveloperSidebar } from "./_components/developer-sidebar";
import { DeveloperHeader } from "./_components/developer-header";
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
    const clerkUser = await currentUser();
    const status = applicationStatus?.status ?? "hr_communication_round";

    // If offer_extended, fetch offers so developer can accept/decline
    let offers: DeveloperOffer[] = [];
    if (status === "offer_extended") {
      offers = (await fetchDeveloperOffers(token)) ?? [];
    }

    return (
      <PendingDashboard
        displayName={clerkUser?.firstName ?? clerkUser?.username ?? "Developer"}
        avatarUrl={clerkUser?.imageUrl ?? null}
        status={status}
        timeline={applicationStatus?.timeline ?? buildDefaultTimeline()}
        offers={offers}
      />
    );
  }

  const clerkUser = await currentUser();
  const user = {
    fullName: clerkUser
      ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        null
      : null,
    imageUrl: clerkUser?.imageUrl ?? null,
  };

  const profile = await fetchDeveloperProfile(token);

  const content = (
    <div className="min-h-screen bg-background">
      <DeveloperSidebar user={user} />
      <DeveloperHeader user={user} />
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );

  if (!profile) {
    return content;
  }

  return (
    <DeveloperProfileProvider profile={profile}>
      {content}
    </DeveloperProfileProvider>
  );
}
