import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle,
  Circle,
  Clock,
  Search,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Enquiry Status | OctogleHire",
  description: "Track your OctogleHire company enquiry progress.",
};

const timeline = [
  { label: "Enquiry Submitted", status: "completed" as const },
  { label: "Requirements Review", status: "active" as const },
  { label: "Talent Shortlist", status: "upcoming" as const },
  { label: "Intro Calls", status: "upcoming" as const },
];

const nextSteps = [
  {
    icon: Search,
    title: "Needs Assessment",
    description:
      "Our team reviews your goals, required skills, and preferred engagement model.",
  },
  {
    icon: Users,
    title: "Curated Matches",
    description:
      "You receive a shortlist of pre-vetted developers that fit your requirements.",
  },
  {
    icon: CalendarClock,
    title: "Guided Introductions",
    description:
      "We coordinate intro calls and support onboarding so you can start quickly.",
  },
];

export default function CompanySignupStatusPage() {
  return (
    <>
      <Navbar />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold lg:text-4xl">
                Enquiry Submitted
              </h1>
              <p className="mt-2 max-w-md text-muted-foreground">
                Thanks for reaching out. We&apos;ll review your requirements and
                contact you within 24 hours.
              </p>
            </div>

            <Card className="mt-10 p-6">
              <div className="space-y-0">
                {timeline.map((item, index) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          item.status === "completed" &&
                            "bg-green-100 text-green-600 dark:bg-green-500/10",
                          item.status === "active" && "bg-primary/10 text-primary",
                          item.status === "upcoming" &&
                            "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="size-4" />
                        ) : item.status === "active" ? (
                          <span className="relative flex size-2.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                          </span>
                        ) : (
                          <Circle className="size-4" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={cn(
                            "my-1 w-0.5 flex-1",
                            index < timeline.findIndex((t) => t.status === "active")
                              ? "bg-green-300 dark:bg-green-600"
                              : "bg-muted",
                          )}
                        />
                      )}
                    </div>

                    <div className={cn("pb-6", index === timeline.length - 1 && "pb-0")}>
                      <p
                        className={cn(
                          "pt-1 text-sm font-medium",
                          item.status === "upcoming" && "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-10">
              <h2 className="text-lg font-semibold">What happens next?</h2>
              <div className="mt-4 space-y-4">
                {nextSteps.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <step.icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/developers">Browse Developers</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/companies/dashboard">Open Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              Average first response: under 24 hours
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
