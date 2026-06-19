"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { createCompanyImpersonationTicket } from "@/lib/api/companies";
import { Button } from "@/components/ui/button";

function ImpersonateInner() {
  const router = useRouter();
  const params = useSearchParams();
  const companyId = params.get("companyId");
  const { getToken } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!isLoaded || started.current) return;
    started.current = true;

    (async () => {
      if (!companyId) {
        setError("Missing company.");
        return;
      }
      try {
        const token = await getToken();
        const data = await createCompanyImpersonationTicket(token, companyId);
        if (!data) {
          setError(
            "Couldn't start impersonation. The company may not be activated, or you may not have permission.",
          );
          return;
        }
        setCompanyName(data.companyName);

        const { createdSessionId } = await signIn!.create({
          strategy: "ticket",
          ticket: data.ticket,
        });

        await setActive!({
          session: createdSessionId,
          organization: data.organizationId,
        });

        router.push("/companies/dashboard");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Impersonation failed.");
      }
    })();
  }, [isLoaded, companyId, getToken, signIn, setActive, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      {error ? (
        <>
          <p className="text-base font-semibold">Couldn&apos;t open the company view</p>
          <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/dashboard/companies">Back to admin</Link>
          </Button>
        </>
      ) : (
        <>
          <Loader2 className="size-6 animate-spin text-pulse" />
          <p className="text-sm text-muted-foreground">
            Signing in as {companyName ?? "the company"}…
          </p>
        </>
      )}
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-pulse" />
        </div>
      }
    >
      <ImpersonateInner />
    </Suspense>
  );
}
