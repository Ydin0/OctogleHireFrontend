import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Terms of Service — OctogleHire",
  description:
    "Terms of Service governing the use of the OctogleHire platform, operated by Octogle Technologies.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-12">
          Last updated: March 2026
        </p>

        <div className="space-y-10">
          {/* 1. Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a
                legally binding agreement between you and Octogle Technologies
                (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                &ldquo;our&rdquo;), governing your access to and use of the
                OctogleHire platform available at octoglehire.com (the
                &ldquo;Platform&rdquo;).
              </p>
              <p>
                By accessing or using the Platform, creating an account, or
                clicking &ldquo;I agree&rdquo;, you acknowledge that you have
                read, understood, and agree to be bound by these Terms. If you
                are using the Platform on behalf of an organisation, you
                represent and warrant that you have the authority to bind that
                organisation to these Terms.
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use
                the Platform.
              </p>
            </div>
          </section>

          {/* 2. Account Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Account Terms</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                You must be at least 18 years of age and capable of forming a
                legally binding contract to create an account and use the
                Platform.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to provide accurate, current, and complete
                information during registration and to update such information
                as necessary to keep it accurate and complete.
              </p>
              <p>
                You must notify us immediately at hello@octoglehire.com if you
                become aware of any unauthorised use of your account or any
                other breach of security. We reserve the right to suspend or
                terminate accounts that contain inaccurate information or are
                used in violation of these Terms.
              </p>
            </div>
          </section>

          {/* 3. Platform Usage */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Platform Usage</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                OctogleHire is a global developer talent platform that connects
                companies (&ldquo;Clients&rdquo;) with pre-vetted software
                developers (&ldquo;Developers&rdquo;). The Platform facilitates
                talent discovery, matching, engagement, and ongoing management
                of developer relationships.
              </p>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Use the Platform for any unlawful purpose or in violation of
                  any applicable local, national, or international law or
                  regulation.
                </li>
                <li>
                  Attempt to gain unauthorised access to any part of the
                  Platform, other user accounts, or any systems or networks
                  connected to the Platform.
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Platform or its underlying infrastructure.
                </li>
                <li>
                  Scrape, crawl, or use automated means to collect data from the
                  Platform without our prior written consent.
                </li>
                <li>
                  Misrepresent your identity, qualifications, or affiliation
                  with any person or organisation.
                </li>
                <li>
                  Circumvent, disable, or otherwise interfere with any
                  security-related features of the Platform.
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Developer Vetting */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Developer Vetting
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                All Developers on the OctogleHire platform undergo a
                multi-stage vetting process that may include technical
                assessments, code reviews, language proficiency evaluations, and
                background verification. Acceptance into the OctogleHire
                network is at our sole discretion.
              </p>
              <p>
                While we take reasonable steps to verify the skills and
                qualifications of Developers, we do not guarantee the accuracy
                or completeness of any Developer profile information. Clients
                are encouraged to conduct their own assessments, interviews, and
                due diligence before entering into an engagement.
              </p>
              <p>
                Developers agree to provide truthful and accurate information
                throughout the vetting process and to promptly update their
                profiles if any material information changes.
              </p>
            </div>
          </section>

          {/* 5. Company Obligations */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Company (Client) Obligations
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Clients using the Platform agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Provide accurate and complete information regarding their
                  hiring requirements, project scope, and working conditions.
                </li>
                <li>
                  Treat Developers with professionalism and respect, and
                  maintain a safe and non-discriminatory working environment.
                </li>
                <li>
                  Comply with all applicable employment laws, regulations, and
                  standards in their jurisdiction and any jurisdiction in which
                  Developers are based.
                </li>
                <li>
                  Not directly engage, hire, or contract with any Developer
                  introduced through OctogleHire outside of the Platform for a
                  period of twelve (12) months following the introduction,
                  unless a separate direct hire fee has been agreed upon in
                  writing.
                </li>
                <li>
                  Make all payments due under their engagement agreements in a
                  timely manner and in accordance with the payment terms set out
                  in Section 6.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Payment Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Payment Terms</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                There are no upfront placement fees for Clients. Clients pay a
                transparent monthly rate per Developer once an engagement
                begins, as specified in the applicable engagement agreement.
              </p>
              <p>
                Invoices are issued monthly and are due within the payment
                period specified in your engagement agreement. Late payments may
                incur interest at a rate of 1.5% per month or the maximum rate
                permitted by applicable law, whichever is lower.
              </p>
              <p>
                Developers are compensated by Octogle Technologies according to
                agreed rates and payment schedules. Payment to Developers is
                contingent upon active engagement and satisfactory performance.
              </p>
              <p>
                All fees quoted are exclusive of applicable taxes, duties, and
                levies unless expressly stated otherwise. You are responsible
                for paying any taxes associated with your use of the Platform.
              </p>
              <p>
                We reserve the right to modify our pricing with thirty (30)
                days&apos; written notice. Any price changes will not affect
                existing engagement agreements for their current term.
              </p>
            </div>
          </section>

          {/* 7. Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              7. Intellectual Property
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                All work product created by a Developer during an engagement is
                owned by the Client, subject to the terms of the applicable
                engagement agreement. Octogle Technologies retains no rights to
                work product created for Clients.
              </p>
              <p>
                The OctogleHire name, logo, and all related marks, designs,
                and slogans are trademarks of Octogle Technologies. You may not
                use these marks without our prior written consent.
              </p>
              <p>
                The Platform, including its design, source code, features, and
                functionality, is and remains the exclusive property of Octogle
                Technologies and is protected by copyright, trademark, and
                other intellectual property laws. Nothing in these Terms grants
                you any right, title, or interest in the Platform beyond the
                limited right to use it in accordance with these Terms.
              </p>
            </div>
          </section>

          {/* 8. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Limitation of Liability
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                To the maximum extent permitted by applicable law, Octogle
                Technologies, its directors, officers, employees, agents, and
                affiliates shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of
                profits, revenue, data, or business opportunities, whether
                incurred directly or indirectly, arising from or related to your
                use of or inability to use the Platform.
              </p>
              <p>
                Our total aggregate liability to you for any claims arising out
                of or related to these Terms or the Platform shall not exceed
                the total fees paid by you to Octogle Technologies during the
                twelve (12) months immediately preceding the event giving rise
                to the claim.
              </p>
              <p>
                The Platform is provided on an &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo; basis. We make no warranties or
                representations, express or implied, regarding the Platform,
                including but not limited to warranties of merchantability,
                fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                Nothing in these Terms excludes or limits liability that cannot
                be excluded or limited under applicable law, including liability
                for death or personal injury caused by negligence or for fraud
                or fraudulent misrepresentation.
              </p>
            </div>
          </section>

          {/* 9. Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Either party may terminate their use of the Platform at any
                time by providing written notice. Active engagements are subject
                to the notice periods and termination provisions specified in
                the applicable engagement agreement.
              </p>
              <p>
                We reserve the right to suspend or terminate your account
                immediately and without prior notice if we reasonably believe
                that you have violated these Terms, engaged in fraudulent or
                illegal activity, or if your continued use of the Platform
                poses a risk to us, other users, or third parties.
              </p>
              <p>
                Upon termination, your right to access and use the Platform will
                cease immediately. Any provisions of these Terms that by their
                nature should survive termination shall survive, including but
                not limited to intellectual property rights, limitation of
                liability, indemnification, and governing law.
              </p>
              <p>
                Termination does not relieve either party of any payment
                obligations incurred prior to the effective date of
                termination.
              </p>
            </div>
          </section>

          {/* 10. Governing Law */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of England and Wales, without regard to its
                conflict of law provisions.
              </p>
              <p>
                Any legal action or proceeding arising out of or related to
                these Terms shall be brought exclusively in the courts of
                England and Wales, and you consent to the personal jurisdiction
                and venue of such courts.
              </p>
            </div>
          </section>

          {/* 11. Dispute Resolution */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              11. Dispute Resolution
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                In the event of any dispute, claim, or controversy arising out
                of or relating to these Terms or the Platform, the parties agree
                to first attempt to resolve the matter through good-faith
                negotiation. Either party may initiate this process by sending
                written notice to the other party describing the dispute.
              </p>
              <p>
                If the dispute cannot be resolved through negotiation within
                thirty (30) days of the initial notice, either party may refer
                the dispute to mediation administered by a mutually agreed
                mediator in London, United Kingdom. The costs of mediation shall
                be shared equally between the parties.
              </p>
              <p>
                If mediation fails to resolve the dispute within sixty (60)
                days of referral, either party may pursue resolution through the
                courts of England and Wales as set out in Section 10.
              </p>
              <p>
                Nothing in this section shall prevent either party from seeking
                injunctive or other equitable relief from a court of competent
                jurisdiction where necessary to protect its rights or interests.
              </p>
            </div>
          </section>

          {/* 12. Modifications */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              12. Modifications to These Terms
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                We reserve the right to modify or replace these Terms at any
                time at our sole discretion. If a revision is material, we will
                provide at least thirty (30) days&apos; notice prior to the new
                terms taking effect by posting the updated Terms on this page
                and updating the &ldquo;Last updated&rdquo; date.
              </p>
              <p>
                We may also notify you of material changes via email to the
                address associated with your account. Your continued use of the
                Platform after the effective date of the revised Terms
                constitutes your acceptance of the changes. If you do not agree
                to the revised Terms, you must stop using the Platform.
              </p>
            </div>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Contact</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                If you have any questions, concerns, or requests regarding these
                Terms of Service, please contact us:
              </p>
              <p>
                Octogle Technologies
                <br />
                Email:{" "}
                <a
                  href="mailto:hello@octoglehire.com"
                  className="text-foreground underline underline-offset-4"
                >
                  hello@octoglehire.com
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://octoglehire.com"
                  className="text-foreground underline underline-offset-4"
                >
                  octoglehire.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
