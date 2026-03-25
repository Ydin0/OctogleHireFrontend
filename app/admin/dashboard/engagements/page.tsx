import { auth } from "@clerk/nextjs/server";

import { fetchAdminEngagements } from "@/lib/api/admin";
import { EngagementsClient } from "./_components/engagements-client";

export default async function AdminEngagementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const engagements = await fetchAdminEngagements(token);

  return (
    <EngagementsClient engagements={engagements} token={token!} />
  );
}
