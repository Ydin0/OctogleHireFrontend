import type { Metadata } from "next";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { DevelopersPage } from "./_components/developers-page";

export const metadata: Metadata = {
  title: "Browse Developers | OctogleHire",
  description:
    "Search and hire pre-vetted developers from 150+ countries. Filter by tech stack, skills, and experience to find your perfect engineering match.",
};

export default function DevelopersRoute() {
  return (
    <div className="developers-route bg-gradient-to-b from-background via-background to-pulse/5">
      <Navbar />
      <DevelopersPage />
      <Footer />
    </div>
  );
}
