import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamList } from "./_components/team-list";
import { AddAdminForm } from "./_components/add-admin-form";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface Admin {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

async function fetchTeam(token: string): Promise<Admin[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/team`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return [];
  const data = (await response.json()) as { admins: Admin[] };
  return data.admins;
}

export default async function TeamPage() {
  const { getToken, userId } = await auth();
  const token = await getToken();

  if (!token || !userId) {
    redirect("/login");
  }

  const admins = await fetchTeam(token);

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Team Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who has admin access to the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Team</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamList
                admins={admins}
                currentUserId={userId}
                token={token}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invite Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <AddAdminForm token={token} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
