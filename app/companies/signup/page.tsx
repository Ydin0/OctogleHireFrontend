import type { Metadata } from "next";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { CompanySignupForm } from "./_components/company-signup-form";

export const metadata: Metadata = {
  title: "Company Sign Up | OctogleHire",
  description:
    "Tell us your hiring needs and OctogleHire will match you with pre-vetted developers.",
};

export default function CompanySignupPage() {
  return (
    <>
      <Navbar />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div>
            <h1 className="text-3xl font-semibold lg:text-4xl">
              Hire Pre-Vetted Developers
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Share your requirements and we&apos;ll match you with vetted talent.
              Our team will review your enquiry and respond quickly with
              shortlist options.
            </p>
          </div>

          <CompanySignupForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
