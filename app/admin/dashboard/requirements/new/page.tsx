import { auth } from "@clerk/nextjs/server";

import { fetchCompanies } from "@/lib/api/companies";
import { AdminRequirementForm } from "./_components/admin-requirement-form";

export default async function NewRequirementPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const companies = await fetchCompanies(token);

  const companyOptions = (companies ?? [])
    .filter((c) => c.status !== "enquired")
    .map((c) => ({ id: c.id, name: c.companyName }));

  return (
    <div className="space-y-6">
      <AdminRequirementForm token={token!} companies={companyOptions} />
    </div>
  );
}
