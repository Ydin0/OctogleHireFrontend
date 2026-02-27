import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { AIReferralTracker } from "@/components/analytics/ai-referral-tracker";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const volksans = localFont({
  src: [
    {
      path: "../public/fonts/volksansTest-Light-BF63eee6e34a6ac.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/volksansTest-Normal-BF63eee6e350bce.otf",
      weight: "350",
      style: "normal",
    },
    {
      path: "../public/fonts/volksansTest-Regular-BF63eee6e3c8d0e.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/volksansTest-SemiBold-BF63eee6e3e5233.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/volksansTest-Bold-BF63eee6e2577d0.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/volksansTest-Black-BF63eee6e404e28.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-volksans",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${volksans.variable} ${dmMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <ClerkProvider signInUrl="/login">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Suspense>
              <AIReferralTracker />
            </Suspense>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
