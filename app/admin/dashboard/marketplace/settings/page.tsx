import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";

import { fetchMarketplaceSettings } from "@/lib/api/admin-marketplace";
import { Button } from "@/components/ui/button";
import { SettingsForm } from "./_components/settings-form";

export default async function MarketplaceSettingsPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const settings = await fetchMarketplaceSettings(token);

  return (
    <>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit rounded-full font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        <Link href="/admin/dashboard/marketplace">
          <ArrowLeft className="size-4" />
          Back to marketplace
        </Link>
      </Button>
      <div>
        <h1 className="text-lg font-semibold">Marketplace settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure the whole marketplace — hero copy, filters, what&apos;s
          included, and how profiles are presented to companies.
        </p>
      </div>
      <SettingsForm settings={settings} token={token!} />
    </>
  );
}
