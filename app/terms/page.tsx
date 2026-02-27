import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${SITE_NAME} terms of service. Read the terms and conditions governing use of the OctogleHire platform.`,
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground not-prose">
            Legal
          </p>
          <h1>Terms of Service</h1>
          <p className="lead">
            Last updated: February 28, 2026
          </p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the OctogleHire platform at octoglehire.com (the
            &quot;Service&quot;), operated by OctogleHire (&quot;we&quot;,
            &quot;us&quot;, or &quot;the Company&quot;). By using the Service,
            you agree to these Terms.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li>
              <strong>&quot;Company Client&quot;</strong> refers to any business
              or individual that uses OctogleHire to hire developers.
            </li>
            <li>
              <strong>&quot;Developer&quot;</strong> refers to any software
              engineer or technical professional who applies to or is part of
              the OctogleHire network.
            </li>
            <li>
              <strong>&quot;Engagement&quot;</strong> refers to any work
              arrangement facilitated through the Service between a Company
              Client and a Developer.
            </li>
          </ul>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old and capable of forming a binding
            contract to use the Service. By creating an account, you represent
            that all information you provide is accurate and complete.
          </p>

          <h2>3. The Service</h2>
          <h3>3.1 For Company Clients</h3>
          <p>
            OctogleHire provides a talent matching service. We source, vet, and
            present pre-qualified developer candidates based on your
            requirements. You may review, interview, and select candidates at
            your discretion.
          </p>
          <h3>3.2 For Developers</h3>
          <p>
            OctogleHire provides a platform for vetted developers to access
            remote work opportunities with global companies. Acceptance into the
            network is subject to our vetting process and is at our sole
            discretion.
          </p>
          <h3>3.3 Employer of Record</h3>
          <p>
            For engagements facilitated through OctogleHire, we may act as
            Employer of Record, managing contracts, payroll, tax compliance, and
            local employment obligations on behalf of Company Clients across
            150+ countries.
          </p>

          <h2>4. Fees and Payment</h2>
          <ul>
            <li>
              There are no upfront fees or placement commissions for Company
              Clients. You pay a transparent monthly rate per developer once an
              engagement begins.
            </li>
            <li>
              Developers are paid by OctogleHire according to agreed rates and
              schedules. Payment is contingent on active engagement and
              satisfactory performance.
            </li>
            <li>
              All fees are exclusive of applicable taxes unless stated otherwise.
            </li>
          </ul>

          <h2>5. Guarantee Period</h2>
          <p>
            Each engagement includes a guarantee period as specified in your
            service agreement. If a developer does not meet your expectations
            during this period, we will provide a replacement at no additional
            cost.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All work product created by a Developer during an engagement is owned
            by the Company Client, subject to the terms of the engagement
            agreement. OctogleHire retains no rights to work product created for
            Company Clients.
          </p>

          <h2>7. Confidentiality</h2>
          <p>
            Both parties agree to maintain the confidentiality of any proprietary
            or sensitive information exchanged during the use of the Service.
            Developers are bound by non-disclosure agreements as part of their
            engagement terms.
          </p>

          <h2>8. Non-Circumvention</h2>
          <p>
            Company Clients agree not to directly engage, hire, or contract with
            any Developer introduced through OctogleHire outside of the platform
            for a period of 12 months following the introduction, unless a direct
            hire fee is agreed upon.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, OctogleHire shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, arising from your use of the
            Service.
          </p>

          <h2>10. Termination</h2>
          <p>
            Either party may terminate their use of the Service at any time.
            Active engagements are subject to the notice periods specified in the
            engagement agreement. We reserve the right to suspend or terminate
            accounts that violate these Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of the jurisdiction in which OctogleHire is incorporated,
            without regard to conflict of law principles.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            any material changes by posting the revised Terms on this page and
            updating the &quot;Last updated&quot; date. Continued use of the
            Service after changes constitutes acceptance of the revised Terms.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have questions about these Terms, contact us at:{" "}
            <a href="mailto:legal@octoglehire.com">legal@octoglehire.com</a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
