import { auth } from "@clerk/nextjs/server";

import { fetchCompanyRequirements } from "@/lib/api/companies";
import { RolesConsole } from "./_components/roles-console";

export default async function RequirementsPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const requirements = await fetchCompanyRequirements(token);

  return <RolesConsole requirements={requirements ?? []} />;
}
