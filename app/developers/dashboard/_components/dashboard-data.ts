import { developers } from "@/lib/data/developers";

export type DeveloperAccountState = "pending" | "approved";

export const currentDeveloper = developers[0];

export const currentDeveloperAccount = {
  state: "approved" as DeveloperAccountState,
  pendingLabel: "Application under review",
};

export const isDeveloperApproved = currentDeveloperAccount.state === "approved";

export const profileCompleteness = 82;
export const readinessScore = 74;

export const statusTimeline = [
  { label: "HR Communication Round", state: "completed" as const },
  { label: "AI Technical Examination", state: "completed" as const },
  { label: "Tech Lead Human Interview", state: "completed" as const },
  {
    label: "Background & Previous Company Checks",
    state: "active" as const,
  },
  { label: "Approved", state: "upcoming" as const },
];

export const readinessChecklist = [
  {
    title: "GitHub Connected",
    done: true,
    hint: "Repository analysis enabled for AI scorecard.",
  },
  {
    title: "Intro Video Uploaded",
    done: false,
    hint: "Add a 60-90 second video to boost trust with companies.",
  },
  {
    title: "Skills Verification",
    done: false,
    hint: "Complete one challenge to unlock a verified badge.",
  },
  {
    title: "Availability Confirmed",
    done: true,
    hint: "Set to Immediate and synced with your profile.",
  },
];

export const opportunities = [
  {
    role: "Senior React Engineer",
    company: "Fintech ScaleUp",
    match: 94,
    timezone: "4-5h overlap",
  },
  {
    role: "Full Stack Product Engineer",
    company: "B2B SaaS Platform",
    match: 88,
    timezone: "3-4h overlap",
  },
  {
    role: "Design Systems Lead",
    company: "Ecommerce Growth Team",
    match: 86,
    timezone: "5h overlap",
  },
];

export const phaseTwoFeatures = [
  "Active and past client engagements",
  "Time tracking and invoice history",
  "Earnings analytics and payout timeline",
  "Client feedback and testimonial history",
];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
