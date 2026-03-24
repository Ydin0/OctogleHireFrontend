import { auth } from "@clerk/nextjs/server";

import { fetchTimeEntries } from "@/lib/api/time-entries";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { TimeEntriesClient } from "./_components/time-entries-client";

export default async function TimeEntriesPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [timeEntries, { isSuperAdmin }] = await Promise.all([
    fetchTimeEntries(token),
    fetchUserRole(token),
  ]);

  return <TimeEntriesClient timeEntries={timeEntries ?? []} token={token!} isSuperAdmin={isSuperAdmin} />;
}
