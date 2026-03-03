import { auth } from "@clerk/nextjs/server";

import { fetchAdminAgencies, fetchAdminAgencyEnquiries } from "@/lib/api/agencies";
import { AgenciesClient } from "./_components/agencies-client";

export default async function AdminAgenciesPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [agencies, enquiries] = await Promise.all([
    fetchAdminAgencies(token),
    fetchAdminAgencyEnquiries(token),
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Agencies</h1>
          <p className="text-sm text-muted-foreground">
            Manage recruitment agency partners and review new registrations.
          </p>
        </div>
      </div>

      <AgenciesClient
        agencies={agencies ?? []}
        enquiries={enquiries ?? []}
        token={token!}
      />
    </>
  );
}
