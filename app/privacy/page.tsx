import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — OctogleHire",
  description:
    "Learn how OctogleHire collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 2026
        </p>

        <div className="mt-10 space-y-10">
          {/* Intro */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Octogle Technologies (&quot;we&quot;, &quot;us&quot;, or
            &quot;the Company&quot;) operates OctogleHire, a global developer
            talent platform available at octoglehire.com (the
            &quot;Service&quot;). This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use the
            Service. By accessing or using the Service, you agree to this
            Privacy Policy.
          </p>

          {/* 1. Data Collection */}
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium">
                  1.1 Information You Provide
                </h3>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  <li>
                    <strong className="text-foreground">Account information:</strong>{" "}
                    name, email address, phone number, company name, and job
                    title when you create an account or submit an enquiry.
                  </li>
                  <li>
                    <strong className="text-foreground">Developer profile data:</strong>{" "}
                    resume, work history, technical skills, portfolio links,
                    salary expectations, and assessment results.
                  </li>
                  <li>
                    <strong className="text-foreground">Payment information:</strong>{" "}
                    billing details processed through our secure payment
                    providers. We do not store full credit card numbers on our
                    servers.
                  </li>
                  <li>
                    <strong className="text-foreground">Communications:</strong>{" "}
                    messages, feedback, and support requests you send to us.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium">
                  1.2 Information Collected Automatically
                </h3>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  <li>
                    <strong className="text-foreground">Usage data:</strong>{" "}
                    pages visited, features used, time spent on the platform,
                    referral sources, and device information.
                  </li>
                  <li>
                    <strong className="text-foreground">Log data:</strong> IP
                    address, browser type, operating system, and timestamps.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-xl font-semibold">
              2. How We Use Your Information
            </h2>
            <ul className="mt-4 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>To provide, operate, and maintain the Service</li>
              <li>
                To match developers with companies based on skills,
                availability, and preferences
              </li>
              <li>To process payments and manage contracts</li>
              <li>
                To communicate with you about your account, matches, and
                platform updates
              </li>
              <li>To improve the Service through analytics and user feedback</li>
              <li>To detect, prevent, and address fraud or security issues</li>
              <li>
                To comply with legal obligations and enforce our Terms of
                Service
              </li>
            </ul>
          </section>

          {/* 3. Cookies */}
          <section>
            <h2 className="text-xl font-semibold">3. Cookies</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to operate and
              improve the Service. The cookies we use fall into the following
              categories:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Essential cookies:</strong>{" "}
                required for authentication, security, and core functionality.
                These cannot be disabled.
              </li>
              <li>
                <strong className="text-foreground">Analytics cookies:</strong>{" "}
                help us understand how users interact with the Service so we can
                improve it. You can opt out of analytics cookies in your browser
                settings.
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Most browsers allow you to control cookies through their settings.
              Disabling essential cookies may prevent you from using parts of the
              Service.
            </p>
          </section>

          {/* 4. Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold">4. Third-Party Services</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We rely on trusted third-party providers to operate the Service.
              Each provider has its own privacy policy governing the use of your
              data:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Clerk</strong> &mdash;
                authentication and user management. Clerk processes your login
                credentials, session tokens, and account information.
              </li>
              <li>
                <strong className="text-foreground">Resend</strong> &mdash;
                transactional email delivery. Your email address is shared with
                Resend to send account notifications, match alerts, and other
                service-related communications.
              </li>
              <li>
                <strong className="text-foreground">Railway</strong> &mdash;
                backend hosting and infrastructure. Application data is stored
                and processed on Railway servers.
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> &mdash;
                frontend hosting and content delivery. Vercel processes request
                data including IP addresses and browser information to serve the
                website.
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              We do not sell your personal data to any third party. Data is
              shared with these providers solely to operate the Service.
            </p>
          </section>

          {/* 5. Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold">
              5. How We Share Your Information
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              In addition to the third-party services listed above, we may share
              your information in the following circumstances:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Matched parties:</strong>{" "}
                when a developer is matched with a company, relevant profile
                information is shared to facilitate the engagement.
              </li>
              <li>
                <strong className="text-foreground">Legal compliance:</strong>{" "}
                when required by law, regulation, subpoena, or other legal
                process.
              </li>
              <li>
                <strong className="text-foreground">Business transfers:</strong>{" "}
                in connection with a merger, acquisition, or sale of assets, your
                data may be transferred as part of that transaction.
              </li>
            </ul>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-xl font-semibold">6. Data Retention</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We retain your personal data for as long as your account is active
              or as needed to provide you with the Service. If you request
              account deletion, we will remove your data within 30 days, except
              where retention is required by law or for legitimate business
              purposes such as resolving disputes or enforcing agreements.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Anonymized and aggregated data that can no longer be associated
              with you may be retained indefinitely for analytics and
              improvement purposes.
            </p>
          </section>

          {/* 7. Data Security */}
          <section>
            <h2 className="text-xl font-semibold">7. Data Security</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including
              encryption in transit (TLS), encryption at rest, access controls,
              and regular security reviews. No method of electronic transmission
              or storage is 100% secure, but we take reasonable steps to protect
              your data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl font-semibold">8. Your Rights</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Request portability of your data in a structured format</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:hello@octoglehire.com"
                className="text-foreground underline underline-offset-4"
              >
                hello@octoglehire.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </section>

          {/* 9. International Transfers */}
          <section>
            <h2 className="text-xl font-semibold">9. International Transfers</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              OctogleHire operates globally. Your data may be transferred to and
              processed in countries other than your own. We ensure appropriate
              safeguards are in place for all international data transfers in
              compliance with applicable data protection laws, including the use
              of standard contractual clauses where required.
            </p>
          </section>

          {/* 10. Children */}
          <section>
            <h2 className="text-xl font-semibold">
              10. Children&apos;s Privacy
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The Service is not directed to individuals under 18. We do not
              knowingly collect personal data from children. If you become aware
              that a child has provided us with personal data, please contact us
              and we will take steps to delete that information.
            </p>
          </section>

          {/* 11. Changes */}
          <section>
            <h2 className="text-xl font-semibold">
              11. Changes to This Policy
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify
              you of material changes by posting the revised policy on this page
              and updating the &quot;Last updated&quot; date. Your continued use
              of the Service after any changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl font-semibold">12. Contact Us</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our
              data practices, contact us at:
            </p>
            <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <p>Octogle Technologies</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@octoglehire.com"
                  className="text-foreground underline underline-offset-4"
                >
                  hello@octoglehire.com
                </a>
              </p>
              <p>
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
