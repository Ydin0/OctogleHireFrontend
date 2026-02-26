"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Mail, ShieldCheck } from "lucide-react";
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

  return "Unable to sign in. Please verify your email and try again.";
};

type Step = "email" | "code";

const SignInForm = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const attempt = await signIn.create({
        identifier: email.trim(),
      });

      const emailCodeFactor = attempt.supportedFirstFactors?.find(
        (f: { strategy: string }) => f.strategy === "email_code"
      ) as { strategy: string; emailAddressId: string } | undefined;

      if (!emailCodeFactor) {
        setError("Email code sign-in is not enabled for this account.");
        return;
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailCodeFactor.emailAddressId,
      });

      setStep("code");
    } catch (submitError: unknown) {
      setError(resolveClerkError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (attempt.status === "complete" && attempt.createdSessionId) {
        await setActive!({ session: attempt.createdSessionId });
        router.replace("/auth/after-sign-in");
        router.refresh();
        return;
      }

      setError("Verification failed. Please try again.");
    } catch (submitError: unknown) {
      setError(resolveClerkError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-pulse/25 bg-card/95 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === "email" ? "Sign In" : "Check Your Email"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form className="space-y-5" onSubmit={handleEmail}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="pl-9"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  Sending Code...
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
        ) : (
          <form className="space-y-5" onSubmit={handleCode}>
            <p className="text-sm text-muted-foreground">
              We sent a verification code to <span className="font-medium text-foreground">{email}</span>.
            </p>

            <div className="space-y-2">
              <Label htmlFor="otp-code">Verification Code</Label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="otp-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  className="pl-9 font-mono tracking-widest"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-red-600">
                  <AlertCircle className="size-4" />
                  Verification failed
                </div>
                <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={!isLoaded || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
            >
              Use a different email
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export { SignInForm };
