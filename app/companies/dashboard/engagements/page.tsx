import { auth } from "@clerk/nextjs/server";

import { fetchCompanyEngagements } from "@/lib/api/companies";
import { EngagementsClient } from "./_components/engagements-client";

export default async function EngagementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const engagements = await fetchCompanyEngagements(token);

  return <EngagementsClient engagements={engagements ?? []} token={token!} />;
}
