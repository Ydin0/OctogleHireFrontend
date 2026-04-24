import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

import { ReviewForm } from "./_components/review-form";

export const metadata: Metadata = {
  title: "Share your OctogleHire story",
  description:
    "Tell us what you were quoted locally and what you actually paid with OctogleHire. Approved stories are featured on our homepage.",
  robots: { index: true, follow: true },
};

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <section className="container mx-auto px-6">
          {/* Header */}
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Customer stories
            </span>
            <h1 className="text-4xl font-medium tracking-tight lg:text-5xl">
              Share your{" "}
              <span className="text-pulse">OctogleHire</span> story
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Tell us what you were quoted locally and what you actually paid.
              We review each submission and feature approved stories on our
              homepage. Takes under 3 minutes.
            </p>
          </div>

          <ReviewForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
