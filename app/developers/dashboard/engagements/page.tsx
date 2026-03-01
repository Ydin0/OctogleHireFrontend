import { auth } from "@clerk/nextjs/server";

import {
  fetchDeveloperEngagements,
  fetchDeveloperTimeEntries,
} from "@/lib/api/developer";
import { EngagementsClient } from "./_components/engagements-client";

export default async function EngagementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [engagements, timeEntries] = await Promise.all([
    fetchDeveloperEngagements(token),
    fetchDeveloperTimeEntries(token),
  ]);

  return (
    <EngagementsClient
      engagements={engagements ?? []}
      timeEntries={timeEntries ?? []}
    />
  );
}
