import { redirect } from "next/navigation";

export default async function CompanyRequirementRedirect({
  params,
}: {
  params: Promise<{ reqId: string }>;
}) {
  const { reqId } = await params;
  redirect(`/admin/dashboard/requirements/${reqId}`);
}
