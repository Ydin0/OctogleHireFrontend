import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { developers } from "@/lib/data/developers";
import { DeveloperProfile } from "./_components/developer-profile";

export function generateStaticParams() {
  return developers.map((dev) => ({ slug: dev.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const developer = developers.find((d) => d.id === slug);

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
  const developer = developers.find((d) => d.id === slug);

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
