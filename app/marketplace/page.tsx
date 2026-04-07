import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { DevelopersPage } from "@/app/developers/_components/developers-page";
import { JsonLd } from "@/components/json-ld";
import {
  absoluteUrl,
  SITE_URL,
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Developer Marketplace",
  description:
    "Search and hire pre-vetted developers from 30+ countries. Filter by tech stack, skills, and experience to find your perfect engineering match.",
  keywords: [
    "hire remote developers",
    "vetted engineers",
    "developer marketplace",
    "remote software engineers",
    "hire freelance developers",
  ],
  alternates: { canonical: absoluteUrl("/marketplace") },
};

export default async function MarketplaceRoute() {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  const jsonLdData = [
    webPageSchema({
      path: "/marketplace",
      name: "Developer Marketplace",
      description:
        "Search and hire pre-vetted developers from 30+ countries. Filter by tech stack, skills, and experience to find your perfect engineering match.",
      type: "CollectionPage",
    }),
    breadcrumbSchema("/marketplace", [
      { name: "Home", url: SITE_URL },
      { name: "Marketplace" },
    ]),
    {
      "@type": "ItemList",
      "@id": absoluteUrl("/marketplace/#item-list"),
      name: "Developer Marketplace",
      description: "Browse 1,000+ pre-vetted engineers",
      url: absoluteUrl("/marketplace"),
      numberOfItems: 1000,
      itemListOrder: "https://schema.org/ItemListUnordered",
    },
    {
      "@type": "Service",
      "@id": absoluteUrl("/marketplace/#service"),
      name: "Developer Marketplace",
      description:
        "Search and hire pre-vetted software developers from 30+ countries. Filter by tech stack, skills, and experience.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Developer Marketplace",
      areaServed: "Worldwide",
    },
  ];

  return (
    <div className="marketplace-route bg-gradient-to-b from-background via-background to-pulse/5">
      <Navbar />

      {isAuthenticated ? (
        <DevelopersPage />
      ) : (
        <div className="relative">
          <div className="pointer-events-none select-none blur-md">
            <DevelopersPage />
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
      <JsonLd data={jsonLdData} />
    </div>
  );
}
