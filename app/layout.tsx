import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "OctogleHire — Hire Top Global Developer Talent",
  description:
    "Connect with pre-vetted, world-class engineers from 150+ countries. Build your dream team in days, not months with OctogleHire.",
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
        <ClerkProvider signInUrl="/login">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
