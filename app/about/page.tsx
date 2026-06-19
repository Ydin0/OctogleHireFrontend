import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { JsonLd } from "@/components/json-ld";
import {
  absoluteUrl,
  SITE_URL,
  SITE_NAME,
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { AboutContent } from "./_components/about-content";

export const metadata: Metadata = {
  title: "About OctogleHire",
  description:
    "OctogleHire connects companies with rigorously vetted engineers from 30+ countries. Learn about our mission, team, and the platform behind 300+ successful placements.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutContent />
      </main>
      <Footer />

      <JsonLd
        data={[
          breadcrumbSchema("/about", [
            { name: "Home", url: SITE_URL },
            { name: "About" },
          ]),
          {
            ...webPageSchema({
              path: "/about",
              name: `About ${SITE_NAME}`,
              description:
                "Learn about OctogleHire's mission to connect companies with the world's best engineering talent.",
              type: "AboutPage",
            }),
            mainEntity: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: SITE_NAME,
              url: absoluteUrl("/"),
              logo: absoluteUrl("/Octogle Darkmode.svg"),
              foundingDate: "2024",
              description:
                "The global talent platform for pre-vetted developers. Build world-class engineering teams in days, not months.",
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                minValue: 10,
              },
              sameAs: [
                "https://twitter.com/octoglehire",
                "https://linkedin.com/company/octoglehire",
              ],
            },
          },
          {
            "@type": "Person",
            "@id": absoluteUrl("/about/#yaseen-deen"),
            name: "Yaseen Deen",
            jobTitle: "CEO",
            description:
              "Leads company strategy, product, and growth. Built OctogleHire to fix how companies access global engineering talent.",
            image: absoluteUrl("/Yaseen Founder.jpg"),
            sameAs: ["https://www.linkedin.com/in/yaseen-deen-52249219b/"],
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Person",
            "@id": absoluteUrl("/about/#stergios-pappos"),
            name: "Stergios Pappos",
            jobTitle: "Head of Technology",
            description:
              "Oversees platform architecture, engineering, and infrastructure. Stergios ensures OctogleHire's technology scales reliably as our network and client base grow.",
            image: absoluteUrl("/Stergios-Technology.jpg"),
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Person",
            "@id": absoluteUrl("/about/#dimitris-pappos"),
            name: "Dimitris Pappos",
            jobTitle: "Head of Marketing",
            description:
              "Drives brand strategy, demand generation, and market positioning. Dimitris builds the channels that connect companies with OctogleHire's vetted talent network.",
            image: absoluteUrl("/Dimitris-Marketing.jpg"),
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Person",
            "@id": absoluteUrl("/about/#anil-wadghule"),
            name: "Anil Wadghule",
            jobTitle: "Tech Lead",
            description:
              "18 years of engineering experience across full-stack, architecture, and Elixir. A recognised speaker at Elixir conferences, Anil leads our technical vetting and assessment design — ensuring only truly exceptional engineers make it through.",
            image: absoluteUrl("/Anil-TechLead.jpg"),
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Person",
            "@id": absoluteUrl("/about/#milo-clarke"),
            name: "Milo Clarke",
            jobTitle: "Client Success Manager",
            description:
              "Manages client relationships end-to-end — from onboarding to ongoing success — ensuring every company gets the right talent and a seamless experience.",
            image: absoluteUrl("/MiloSales.jpg"),
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
    </>
  );
}
