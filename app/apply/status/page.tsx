import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  Clock,
  MessageSquare,
  Rocket,
  Search,
  UserCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Application Status | OctogleHire",
  description: "Track the status of your OctogleHire developer application.",
};

const timeline = [
  {
    label: "HR Communication Round",
    status: "active" as const,
    icon: MessageSquare,
  },
  {
    label: "AI Technical Examination",
    status: "upcoming" as const,
    icon: Search,
  },
  {
    label: "Tech Lead Human Interview",
    status: "upcoming" as const,
    icon: UserCheck,
  },
  {
    label: "Background & Previous Company Checks",
    status: "upcoming" as const,
    icon: Clock,
  },
  {
    label: "Approved",
    status: "upcoming" as const,
    icon: Rocket,
  },
];

const nextSteps = [
  {
    icon: Clock,
    title: "HR Communication Round",
    description:
      "A recruiter reaches out to align on your profile, communication quality, and role expectations.",
  },
  {
    icon: MessageSquare,
    title: "AI Technical Examination",
    description:
      "You complete a structured technical exam tailored to your stack and experience level.",
  },
  {
    icon: UserCheck,
    title: "Tech Lead Human Interview",
    description:
      "A senior technical reviewer validates architecture thinking, code quality, and decision making.",
  },
  {
    icon: Search,
    title: "Background & Previous Company Checks",
    description:
      "We verify work history and references before final approval.",
  },
  {
    icon: Rocket,
    title: "Approved & Dashboard Unlock",
    description:
      "Once approved, your full developer dashboard and matching pipeline become available.",
  },
];

export default function StatusPage() {
  return (
    <>
      <Navbar />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold lg:text-4xl">
                Application Submitted
              </h1>
              <p className="mt-2 max-w-md text-muted-foreground">
                Thank you for applying! We&apos;ll review your application
                within 48 hours.
              </p>
            </div>

            {/* Timeline */}
            <Card className="mt-10 p-6">
              <div className="space-y-0">
                {timeline.map((item, index) => (
                  <div key={item.label} className="flex gap-4">
                    {/* Vertical line + icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          item.status === "completed" &&
                            "bg-green-100 text-green-600 dark:bg-green-500/10",
                          item.status === "active" &&
                            "bg-primary/10 text-primary",
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

                    {/* Content */}
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

            {/* What happens next */}
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

            {/* Back button */}
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
