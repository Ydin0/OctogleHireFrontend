import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { resolveDashboardPath } from "@/lib/auth/account-type";

export default async function AfterSignInPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await currentUser();
  const destination = resolveDashboardPath({ user, orgId });

  redirect(destination);
}
