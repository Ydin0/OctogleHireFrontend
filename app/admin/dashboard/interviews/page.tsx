import { auth } from "@clerk/nextjs/server";

import { fetchInterviews, fetchAdminTeam } from "@/lib/api/admin";
import { InterviewsClient } from "./_components/interviews-client";

export default async function InterviewsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [interviews, team] = await Promise.all([
    fetchInterviews(token),
    fetchAdminTeam(token),
  ]);

  return (
    <InterviewsClient
      interviews={interviews}
      team={team}
      token={token!}
    />
  );
}
