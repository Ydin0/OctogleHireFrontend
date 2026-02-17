import Link from "next/link";
import { Button } from "@/components/ui/button";

type AuthPlaceholderProps = {
  audience: "Developers" | "Companies";
  mode: "Sign in" | "Sign up";
  alternateHref: string;
  alternateLabel: string;
};

const AuthPlaceholder = ({
  audience,
  mode,
  alternateHref,
  alternateLabel,
}: AuthPlaceholderProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-xl rounded-xl border border-border/70 bg-card p-8 shadow-sm">
        <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
          {audience} {mode}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Authentication setup is in progress
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Clerk integration has been temporarily removed so the current build can
          proceed while core product work continues.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={alternateHref}>{alternateLabel}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export { AuthPlaceholder };
