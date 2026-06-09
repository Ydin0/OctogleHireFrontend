import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";

import { fetchApplication } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { MarketplaceEditor } from "./_components/marketplace-editor";

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function MarketplaceEditorPage({
  params,
}: EditorPageProps) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  const result = await fetchApplication(token, id);
  if (!result) notFound();

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
      <MarketplaceEditor application={result.application} token={token!} />
    </>
  );
}
