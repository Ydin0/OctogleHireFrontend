"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resolveClerkError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors)
  ) {
    const firstError = (error as { errors: Array<Record<string, unknown>> }).errors[0];
    const longMessage = firstError?.longMessage;
    const message = firstError?.message;

    if (typeof longMessage === "string" && longMessage.length > 0) {
      return longMessage;
    }

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Unable to sign in. Please verify your credentials and try again.";
};

const SignInForm = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const attempt = await signIn.create({
        identifier: identifier.trim(),
        password,
      });

      if (attempt.status !== "complete" || !attempt.createdSessionId) {
        setError("Additional verification is required for this account.");
        return;
      }

      await setActive({ session: attempt.createdSessionId });
      router.replace("/auth/after-sign-in");
      router.refresh();
    } catch (submitError: unknown) {
      setError(resolveClerkError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-pulse/25 bg-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="identifier"
                name="identifier"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="pl-9"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="pl-9"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm">
              <div className="flex items-center gap-2 font-medium text-red-600">
                <AlertCircle className="size-4" />
                Authentication failed
              </div>
              <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={!isLoaded || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Accounts are provisioned by admins only in this phase.
          </p>

          <p className="text-center text-xs text-muted-foreground">
            Need access? Contact your OctogleHire admin or return{" "}
            <Link href="/" className="text-pulse hover:underline">
              home
            </Link>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export { SignInForm };
