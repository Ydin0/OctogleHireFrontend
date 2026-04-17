import { auth } from "@clerk/nextjs/server";

import { fetchTimeEntries } from "@/lib/api/time-entries";
import { fetchAdminEngagements } from "@/lib/api/admin";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { TimeEntriesClient } from "./_components/time-entries-client";

export default async function TimeEntriesPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [timeEntries, engagements, { isSuperAdmin }] = await Promise.all([
    fetchTimeEntries(token),
    fetchAdminEngagements(token),
    fetchUserRole(token),
  ]);

  return (
    <TimeEntriesClient
      timeEntries={timeEntries ?? []}
      engagements={engagements}
      token={token!}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
