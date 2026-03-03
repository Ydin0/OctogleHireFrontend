import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ApplyForm } from "../../_components/apply-form";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface AgencyApplyPageProps {
  params: Promise<{ referralCode: string }>;
}

async function fetchAgencyInfo(
  referralCode: string
): Promise<{ name: string; logo: string | null } | null> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/public/agencies/${encodeURIComponent(referralCode)}/info`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return null;
    return (await response.json()) as { name: string; logo: string | null };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: AgencyApplyPageProps): Promise<Metadata> {
  const { referralCode } = await params;
  const agency = await fetchAgencyInfo(referralCode);

  return {
    title: agency
      ? `Apply via ${agency.name} | OctogleHire`
      : "Apply as a Developer | OctogleHire",
    robots: { index: false, follow: false },
  };
}

export default async function AgencyApplyPage({
  params,
}: AgencyApplyPageProps) {
  const { referralCode } = await params;
  const agency = await fetchAgencyInfo(referralCode);

  if (!agency) {
    redirect("/apply");
  }

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto flex items-center gap-3 px-6 py-3">
          {agency.logo && (
            <img
              src={agency.logo}
              alt=""
              className="size-8 rounded-md object-contain"
            />
          )}
          <p className="text-sm text-muted-foreground">
            Applying via{" "}
            <span className="font-medium text-foreground">{agency.name}</span>
          </p>
        </div>
      </div>
      <ApplyForm referralCode={referralCode} />
    </>
  );
}
