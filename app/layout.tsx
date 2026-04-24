import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";
import { Toaster } from "sonner";
import { AIReferralTracker } from "@/components/analytics/ai-referral-tracker";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OctogleHire — Hire Top Global Developer Talent",
    template: "%s — OctogleHire",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "hire developers",
    "remote engineers",
    "pre-vetted developers",
    "global talent",
    "hire remote developers",
    "software engineers for hire",
    "hire Indian developers",
    "offshore development",
    "engineering talent platform",
    "OctogleHire",
  ],
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@octoglehire",
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    other: {
      "facebook-domain-verification": "jmxis6toegiaoj69p3v9608bquu64e",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${dmMono.variable} antialiased`}
      >
        <JsonLd data={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]} />
        <GoogleAnalytics />
        <MetaPixel />
        <MicrosoftClarity />
        <ClerkProvider signInUrl="/login">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors closeButton position="top-right" />
            <Suspense>
              <AIReferralTracker />
            </Suspense>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
