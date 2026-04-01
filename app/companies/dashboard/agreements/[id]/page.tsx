import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchCompanyAgreement } from "@/lib/api/companies";
import { AgreementDetailClient } from "./_components/agreement-detail-client";

export default async function AgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getToken } = await auth();
  const token = await getToken();
  const { id } = await params;

  const agreement = await fetchCompanyAgreement(token, id);
  if (!agreement) redirect("/companies/dashboard/agreements");

  return <AgreementDetailClient agreement={agreement} token={token!} />;
}
