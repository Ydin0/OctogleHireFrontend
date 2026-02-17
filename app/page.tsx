import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { VettingProcess } from "@/components/marketing/vetting-process";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { DeveloperProfiles } from "@/components/marketing/developer-profiles";

import { Testimonials } from "@/components/marketing/testimonials";
import { Cta } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <VettingProcess />
      <ComparisonTable />
      <DeveloperProfiles />
      <Testimonials />
      <Cta />
      <Footer />
    </>
  );
}
