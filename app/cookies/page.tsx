import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Cookie Policy — OctogleHire",
  description:
    "Learn how OctogleHire uses cookies to improve your experience on our platform.",
};

const CookiePolicyPage = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <div className="space-y-2 mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Legal
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 2026
          </p>
        </div>

        <div className="space-y-10">
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Introduction</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Cookie Policy explains how Octogle Technologies
              (&quot;OctogleHire,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) uses cookies and similar tracking technologies
              when you visit octoglehire.com (the &quot;Website&quot;). By
              continuing to use our Website, you consent to the use of cookies
              as described in this policy.
            </p>
          </section>

          {/* What Are Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">What Are Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your device
              (computer, tablet, or mobile phone) when you visit a website. They
              are widely used to make websites work more efficiently, provide a
              better user experience, and supply information to website owners.
              Cookies can be &quot;persistent&quot; (remaining on your device
              until they expire or you delete them) or &quot;session-based&quot;
              (deleted when you close your browser).
            </p>
          </section>

          {/* Types of Cookies We Use */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Types of Cookies We Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the following categories of cookies on our Website:
            </p>

            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-base font-semibold">
                  Essential Cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These cookies are strictly necessary for the Website to
                  function. They enable core features such as authentication,
                  security, and session management. Our authentication system is
                  powered by Clerk, which sets cookies required to keep you
                  signed in and to protect against unauthorized access. Without
                  these cookies, the services you have requested cannot be
                  provided.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">
                  Functional Cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Functional cookies allow the Website to remember choices you
                  make (such as your preferred language or theme setting) and
                  provide enhanced, personalized features. These cookies are also
                  used by Clerk to manage your session state and ensure a
                  seamless authentication experience across pages.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">
                  Analytics Cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use Google Analytics to collect anonymous information about
                  how visitors use our Website, including which pages are visited
                  most often, how visitors navigate the site, and whether they
                  encounter errors. The data collected helps us understand usage
                  patterns and improve the Website. Google Analytics cookies do
                  not identify you personally.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold">
                  Preference Cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Preference cookies store your settings and preferences, such
                  as your selected theme (light or dark mode) and display
                  options, so that they persist between visits and across
                  sessions.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Table */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Cookies Used on This Website</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The table below lists the specific cookies set by our Website and
              their purposes.
            </p>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Cookie Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 font-mono text-xs">__session</td>
                    <td className="px-4 py-3">Clerk</td>
                    <td className="px-4 py-3">
                      Maintains authenticated user session
                    </td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 font-mono text-xs">
                      __client_uat
                    </td>
                    <td className="px-4 py-3">Clerk</td>
                    <td className="px-4 py-3">
                      Tracks client-side authentication state
                    </td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 font-mono text-xs">__clerk_db_jwt</td>
                    <td className="px-4 py-3">Clerk</td>
                    <td className="px-4 py-3">
                      Stores authentication token for API requests
                    </td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 font-mono text-xs">_ga</td>
                    <td className="px-4 py-3">Google Analytics</td>
                    <td className="px-4 py-3">
                      Distinguishes unique visitors
                    </td>
                    <td className="px-4 py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 font-mono text-xs">_ga_*</td>
                    <td className="px-4 py-3">Google Analytics</td>
                    <td className="px-4 py-3">
                      Persists session state for analytics
                    </td>
                    <td className="px-4 py-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">theme</td>
                    <td className="px-4 py-3">OctogleHire</td>
                    <td className="px-4 py-3">
                      Stores your light/dark mode preference
                    </td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Third-Party Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Some cookies on our Website are set by third-party services that
              appear on our pages. We do not control the setting of these
              cookies. The third parties that may set cookies through our Website
              include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong className="text-foreground">Clerk</strong> — for
                authentication and session management. See{" "}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Clerk&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong className="text-foreground">Google Analytics</strong> —
                for website usage analytics. See{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          {/* How to Manage Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">How to Manage Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most web browsers allow you to control cookies through their
              settings. You can typically find these controls in the
              &quot;Settings,&quot; &quot;Preferences,&quot; or
              &quot;Privacy&quot; section of your browser. The following links
              may help you manage cookies in common browsers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please note that disabling essential cookies may prevent you from
              using certain features of our Website, including signing in to
              your account.
            </p>
          </section>

          {/* Updates to This Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Updates to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. When we make changes, we will update the
              &quot;Last updated&quot; date at the top of this page. We
              encourage you to review this policy periodically to stay informed
              about how we use cookies.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us at{" "}
              <a
                href="mailto:hello@octoglehire.com"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                hello@octoglehire.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookiePolicyPage;
