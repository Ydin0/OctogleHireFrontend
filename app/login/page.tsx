import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { SignInForm } from "./_components/sign-in-form";

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/auth/after-sign-in");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <section className="space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.08em] text-sky-700 dark:border-pulse/30 dark:bg-pulse/10 dark:text-pulse">
            <ShieldCheck className="size-3.5" />
            Secure Access
          </p>

            <h1 className="text-4xl font-semibold tracking-tight">Sign in to OctogleHire</h1>

            <p className="text-base text-muted-foreground">
              One sign-in flow for all invited users. You&apos;ll be redirected to
              your workspace based on your assigned account role.
            </p>
          </section>

          <SignInForm />
        </div>
      </div>
    </main>
  );
}
