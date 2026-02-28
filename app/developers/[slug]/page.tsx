import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { developers } from "@/lib/data/developers";
import { fetchPublicDeveloper } from "@/lib/api/public-developers";
import { DeveloperProfile } from "./_components/developer-profile";

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

  return (
    <>
      <Navbar />
      <DeveloperProfile developer={developer} />
      <Footer />
    </>
  );
}
