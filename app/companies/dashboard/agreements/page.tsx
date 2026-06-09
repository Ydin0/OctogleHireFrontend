import { auth } from "@clerk/nextjs/server";

import { fetchCompanyAgreements } from "@/lib/api/companies";
import { AgreementsClient } from "./_components/agreements-client";
import { ConsoleScroll } from "../_components/console-scroll";

export default async function AgreementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const agreements = await fetchCompanyAgreements(token);

  return (
    <ConsoleScroll>
      <AgreementsClient agreements={agreements} />
    </ConsoleScroll>
  );
}
