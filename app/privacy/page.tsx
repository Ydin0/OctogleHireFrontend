import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_NAME} privacy policy. Learn how we collect, use, and protect your personal data.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground not-prose">
            Legal
          </p>
          <h1>Privacy Policy</h1>
          <p className="lead">
            Last updated: February 28, 2026
          </p>
          <p>
            OctogleHire (&quot;we&quot;, &quot;us&quot;, or &quot;the
            Company&quot;) is committed to protecting your personal data. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our platform at octoglehire.com (the
            &quot;Service&quot;).
          </p>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Account information:</strong> name, email address, phone
              number, company name, and job title when you create an account or
              submit an enquiry.
            </li>
            <li>
              <strong>Profile information (developers):</strong> resume, work
              history, technical skills, portfolio links, and assessment results.
            </li>
            <li>
              <strong>Payment information:</strong> billing details processed
              through our secure payment providers. We do not store full credit
              card numbers on our servers.
            </li>
            <li>
              <strong>Communications:</strong> messages, feedback, and support
              requests you send to us.
            </li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Usage data:</strong> pages visited, features used, time
              spent on the platform, referral sources, and device information.
            </li>
            <li>
              <strong>Cookies and similar technologies:</strong> we use essential
              cookies for authentication and optional analytics cookies to
              improve the Service. You can manage cookie preferences in your
              browser settings.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To match developers with companies based on skills, availability, and preferences</li>
            <li>To process payments and manage contracts</li>
            <li>To communicate with you about your account, matches, and platform updates</li>
            <li>To improve the Service through analytics and feedback</li>
            <li>To comply with legal obligations and enforce our Terms of Service</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul>
            <li>
              <strong>Matched parties:</strong> when a developer is matched with
              a company, relevant profile information is shared to facilitate the
              engagement.
            </li>
            <li>
              <strong>Service providers:</strong> trusted third parties that help
              us operate the platform (payment processors, cloud hosting,
              analytics providers).
            </li>
            <li>
              <strong>Legal compliance:</strong> when required by law, regulation,
              or legal process.
            </li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or
            as needed to provide you with the Service. If you request account
            deletion, we will remove your data within 30 days, except where
            retention is required by law.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption
            in transit (TLS), encryption at rest, access controls, and regular
            security audits. No method of electronic transmission or storage is
            100% secure, but we take reasonable steps to protect your data.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@octoglehire.com">privacy@octoglehire.com</a>.
          </p>

          <h2>7. International Transfers</h2>
          <p>
            OctogleHire operates globally across 150+ countries. Your data may be
            transferred to and processed in countries other than your own. We
            ensure appropriate safeguards are in place for all international data
            transfers in compliance with applicable data protection laws.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to individuals under 18. We do not
            knowingly collect personal data from children. If you become aware
            that a child has provided us with personal data, please contact us.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at:{" "}
            <a href="mailto:privacy@octoglehire.com">privacy@octoglehire.com</a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
