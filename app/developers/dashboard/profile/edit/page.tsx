import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ProfileEditor } from "./profile-editor";
import { fetchDeveloperProfile } from "@/lib/api/developer";

export default async function ProfileEditPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();
  const profile = await fetchDeveloperProfile(token);

  return <ProfileEditor profile={profile} />;
}
