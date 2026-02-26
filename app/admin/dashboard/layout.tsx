import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminHeader } from "./_components/admin-header";
import { resolveDashboardPathFromRole } from "@/lib/auth/account-type";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";

export const metadata: Metadata = {
  title: "Admin Dashboard | OctogleHire",
  description:
    "Manage developer applications and company enquiries from the admin dashboard.",
};

export default async function AdminDashboardLayout({
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

  if (destination !== "/admin/dashboard") {
    redirect(destination);
  }

  const clerkUser = await currentUser();
  const user = {
    fullName: clerkUser
      ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        null
      : null,
    email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
    imageUrl: clerkUser?.imageUrl ?? null,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar user={user} />
      <AdminHeader user={user} />
      <main className="lg:ml-64">
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
