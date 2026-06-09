import { auth } from "@clerk/nextjs/server";

import { fetchCompanyShortlist } from "@/lib/api/companies";
import { SavedConsole } from "./_components/saved-console";

export default async function SavedPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const developers = await fetchCompanyShortlist(token);

  return <SavedConsole developers={developers} />;
}
