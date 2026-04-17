import { auth } from "@clerk/nextjs/server";

import {
  fetchMatchesAwaitingApproval,
  fetchUpcomingStarts,
} from "@/lib/api/admin";
import { ApprovalsClient } from "./_components/approvals-client";

export default async function AdminApprovalsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [pending, upcoming] = await Promise.all([
    fetchMatchesAwaitingApproval(token),
    fetchUpcomingStarts(token),
  ]);

  return (
    <ApprovalsClient
      pending={pending}
      upcoming={upcoming}
      token={token!}
    />
  );
}
