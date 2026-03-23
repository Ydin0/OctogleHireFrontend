import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { developers } from "@/lib/data/developers";
import { fetchPublicDeveloper } from "@/lib/api/public-developers";
import { DeveloperProfile } from "./_components/developer-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const revalidate = 60;

export function generateStaticParams() {
  return developers.map((dev) => ({ slug: dev.id }));
}

async function getDeveloper(slug: string) {
  const staticDev = developers.find((d) => d.id === slug);

  // Static slugs: use seed data directly (no API call needed at build)
  if (staticDev) return staticDev;

  // Dynamic slugs (live developers from DB): fetch from API
  const apiDeveloper = await fetchPublicDeveloper(slug);
  return apiDeveloper ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const developer = await getDeveloper(slug);

  if (!developer) {
    return { title: "Developer Not Found | OctogleHire" };
  }

  return {
    title: `${developer.name} – ${developer.role} | OctogleHire`,
    description: developer.about,
  };
}

export default async function DeveloperProfileRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const developer = await getDeveloper(slug);

  if (!developer) {
    notFound();
  }

  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <>
      <Navbar />

      {isAuthenticated ? (
        <DeveloperProfile developer={developer} />
      ) : (
        <div className="relative">
          <div className="pointer-events-none select-none blur-md">
            <DeveloperProfile developer={developer} />
          </div>

          <div className="absolute inset-0 flex items-start justify-center pt-32">
            <Card className="w-full max-w-md border bg-background px-2 shadow-lg">
              <CardHeader className="text-center">
                <h2 className="text-lg font-semibold">
                  Sign up to access the marketplace
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create your free account to browse 1,000+ pre-vetted engineers
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <Button asChild className="w-full rounded-full">
                  <Link href="/companies/signup">Sign Up</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <Link href="/companies/signup">Book a Demo</Link>
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
