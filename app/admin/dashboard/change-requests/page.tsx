import { auth } from "@clerk/nextjs/server";

import { fetchAdminChangeRequests } from "@/lib/api/engagement-change-requests";
import { ChangeRequestsClient } from "./_components/change-requests-client";

export default async function ChangeRequestsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const requests = await fetchAdminChangeRequests(token);

  return <ChangeRequestsClient requests={requests ?? []} token={token!} />;
}
