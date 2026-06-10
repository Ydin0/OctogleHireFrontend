import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CompanyRail } from "./_components/company-rail";
import { ChatWidget } from "./_components/chat-widget";
import { ShortlistProvider } from "./_components/shortlist-context";
import { InterviewRequestProvider } from "./_components/interview-request-context";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { fetchCompanyProfile, fetchCompanyRequirements, fetchCompanyAgreements, fetchCompanyShortlist } from "@/lib/api/companies";

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

  const [companyProfile, requirements, agreements, shortlist] = await Promise.all([
    fetchCompanyProfile(token),
    fetchCompanyRequirements(token),
    fetchCompanyAgreements(token),
    fetchCompanyShortlist(token),
  ]);

  const sidebarCounts = {
    requirements: (requirements ?? []).filter((r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled").length,
    candidates: (requirements ?? []).reduce((sum, r) => {
      const matches = r.proposedMatches ?? [];
      return sum + matches.filter((m) => m.status === "accepted" || m.status === "interview_scheduled").length;
    }, 0),
    agreements: agreements.filter((a) => a.status === "pending").length,
  };

  const companyName = companyProfile?.companyName ?? "Acme Corp";
  const companyInitials = companyName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const initialShortlistIds = (shortlist ?? []).map((d) => d.id);

  // Open roles offered in the "request interview" dialog's role picker.
  const openRoles = (requirements ?? [])
    .filter((r) => r.status === "open" || r.status === "matching" || r.status === "partially_filled")
    .map((r) => ({ id: r.id, title: r.title }));

  return (
    <ShortlistProvider initialIds={initialShortlistIds}>
      <InterviewRequestProvider roles={openRoles}>
        <div className="marketplace-route flex h-screen overflow-hidden bg-background text-foreground">
          <CompanyRail counts={sidebarCounts} companyInitials={companyInitials} />
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
          <ChatWidget
            accountManagerId={companyProfile?.accountManagerId ?? undefined}
            accountManagerName={companyProfile?.accountManager?.name}
            accountManagerAvatar={companyProfile?.accountManager?.profilePhotoUrl}
          />
        </div>
      </InterviewRequestProvider>
    </ShortlistProvider>
  );
}
