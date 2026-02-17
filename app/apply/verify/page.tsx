"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { AlertCircle, Loader2, Mail } from "lucide-react";

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

  return "Unable to verify your account right now. Please try again.";
};

export default function ApplyVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [code, setCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = useMemo(
    () => searchParams.get("email")?.trim() ?? "",
    [searchParams]
  );

  const sendCode = async () => {
    if (!isLoaded || !signIn || !email || isSendingCode) return;

    setIsSendingCode(true);
    setError(null);

    try {
      const attempt = await signIn.create({ identifier: email });
      const emailFactor = attempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (!emailFactor || !("emailAddressId" in emailFactor)) {
        throw new Error(
          "Email OTP is not available for this account. Ask admin to enable email verification."
        );
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setIsCodeSent(true);
    } catch (sendError) {
      setError(resolveClerkError(sendError));
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || !signIn || !setActive || isVerifying) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });

      if (result.status !== "complete" || !result.createdSessionId) {
        throw new Error("Verification incomplete. Please try a new code.");
      }

      await setActive({ session: result.createdSessionId });
      router.replace("/developers/dashboard");
      router.refresh();
    } catch (verifyError) {
      setError(resolveClerkError(verifyError));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <section className="space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.08em] text-sky-700 dark:border-pulse/30 dark:bg-pulse/10 dark:text-pulse">
              <Mail className="size-3.5" />
              Verify Access
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ll send a one-time passcode to <strong>{email || "your email"}</strong>.
            </p>
          </section>

          <Card className="border-pulse/25 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Developer Access Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCodeSent ? (
                <Button
                  type="button"
                  className="w-full"
                  onClick={sendCode}
                  disabled={!email || isSendingCode || !isLoaded}
                >
                  {isSendingCode ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              ) : (
                <form className="space-y-4" onSubmit={verifyCode}>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isLoaded || isVerifying || code.trim().length < 4}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify and Continue"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={sendCode}
                    disabled={!isLoaded || isSendingCode}
                  >
                    Resend OTP
                  </Button>
                </form>
              )}

              {error ? (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium text-red-600">
                    <AlertCircle className="size-4" />
                    Verification failed
                  </div>
                  <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
                </div>
              ) : null}

              <p className="text-center text-xs text-muted-foreground">
                Didn&apos;t apply yet?{" "}
                <Link href="/apply" className="text-pulse hover:underline">
                  Submit your developer application
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
