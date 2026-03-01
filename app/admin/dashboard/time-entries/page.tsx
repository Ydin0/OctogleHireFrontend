import { auth } from "@clerk/nextjs/server";

import { fetchTimeEntries } from "@/lib/api/time-entries";
import { TimeEntriesClient } from "./_components/time-entries-client";

export default async function TimeEntriesPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const timeEntries = await fetchTimeEntries(token);

  return <TimeEntriesClient timeEntries={timeEntries ?? []} token={token!} />;
}
