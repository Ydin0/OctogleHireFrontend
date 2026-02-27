"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { AlertCircle, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/marketing/navbar";

const resolveClerkError = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors)
  ) {
    const firstError = (error as { errors: Array<Record<string, unknown>> }).errors[0];
    const code = firstError?.code;
    const longMessage = firstError?.longMessage;
    const message = firstError?.message;

    // Suppress "already signed in" — we handle it in the UI
    if (code === "session_exists") {
      return "You're already signed in.";
    }

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

const isClerkErrorCode = (error: unknown, code: string): boolean => {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors?: unknown[] }).errors)
  ) {
    return (error as { errors: Array<Record<string, unknown>> }).errors.some(
      (e) => e.code === code
    );
  }
  return false;
};

type VerifyMode = "signup" | "signin";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [code, setCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<VerifyMode>("signup");

  const isLoaded = isSignInLoaded && isSignUpLoaded;

  const email = useMemo(
    () => searchParams.get("email")?.trim() ?? "",
    [searchParams]
  );

  // If the user is already signed in, show a redirect option
  if (isSignedIn) {
    return (
      <>
        <Navbar />
        <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-md space-y-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                <Mail className="size-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Already Signed In
              </span>
              <h1 className="text-lg font-semibold">
                You&apos;re already authenticated
              </h1>
              <p className="text-sm text-muted-foreground">
                Your application has been submitted. You can go to your dashboard now.
              </p>
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full rounded-full"
                  onClick={() => router.replace("/auth/after-sign-in")}
                >
                  Go to Dashboard
                </Button>
                <p className="text-xs text-muted-foreground">
                  Or return{" "}
                  <Link href="/" className="text-foreground hover:underline">
                    home
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const sendCode = async () => {
    if (!isLoaded || !signUp || !signIn || !email || isSendingCode) return;

    setIsSendingCode(true);
    setError(null);

    try {
      // Try signUp first — creates a new Clerk account for the developer
      await signUp.create({ emailAddress: email });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setMode("signup");
      setIsCodeSent(true);
    } catch (signUpError) {
      // If the email already has a Clerk account, fall back to signIn
      if (
        isClerkErrorCode(signUpError, "form_identifier_exists") ||
        isClerkErrorCode(signUpError, "form_email_address_exists")
      ) {
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

          setMode("signin");
          setIsCodeSent(true);
        } catch (signInError) {
          setError(resolveClerkError(signInError));
        }
      } else {
        setError(resolveClerkError(signUpError));
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoaded || !signUp || !signIn || isVerifying) return;

    setIsVerifying(true);
    setError(null);

    try {
      if (mode === "signup") {
        const result = await signUp.attemptEmailAddressVerification({
          code: code.trim(),
        });

        if (result.status !== "complete" || !result.createdSessionId) {
          throw new Error("Verification incomplete. Please try a new code.");
        }

        await setSignUpActive!({ session: result.createdSessionId });
      } else {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: code.trim(),
        });

        if (result.status !== "complete" || !result.createdSessionId) {
          throw new Error("Verification incomplete. Please try a new code.");
        }

        await setSignInActive!({ session: result.createdSessionId });
      }

      // Route through after-sign-in to resolve the correct dashboard
      router.replace("/auth/after-sign-in");
      router.refresh();
    } catch (verifyError) {
      setError(resolveClerkError(verifyError));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Mail className="size-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Verify Access
              </span>
              <h1 className="mt-3 text-lg font-semibold">Verify your email</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll send a one-time passcode to <strong>{email || "your email"}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6 space-y-4">
              <p className="text-sm font-semibold">Developer Access Confirmation</p>

              {!isCodeSent ? (
                <Button
                  type="button"
                  className="w-full rounded-full"
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
                    className="w-full rounded-full"
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
                    className="w-full rounded-full"
                    onClick={sendCode}
                    disabled={!isLoaded || isSendingCode}
                  >
                    Resend OTP
                  </Button>
                </form>
              )}

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium text-destructive">
                    <AlertCircle className="size-4" />
                    Verification failed
                  </div>
                  <p className="mt-1 text-destructive/80">{error}</p>
                </div>
              ) : null}

              <p className="text-center text-xs text-muted-foreground">
                Didn&apos;t apply yet?{" "}
                <Link href="/apply" className="text-foreground hover:underline">
                  Submit your developer application
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ApplyVerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
