import type { Notification } from "./types";

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "new_match",
    title: "New match proposed",
    description:
      "A senior React engineer has been matched to your Frontend Developer requirement.",
    href: "/companies/dashboard/requirements",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "n2",
    type: "developer_accepted",
    title: "Developer accepted",
    description:
      "Carlos M. accepted the match for your Backend API requirement. Review and confirm hire.",
    href: "/companies/dashboard/requirements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n3",
    type: "invoice_generated",
    title: "Invoice ready",
    description:
      "Your February 2026 invoice has been generated and is ready for review.",
    href: "/companies/dashboard/invoices",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "n4",
    type: "engagement_started",
    title: "Engagement started",
    description:
      "Ana R. has officially started on the Full-Stack Developer engagement.",
    href: "/companies/dashboard/engagements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "n5",
    type: "developer_declined",
    title: "Developer declined",
    description:
      "James L. declined the match for your DevOps Engineer requirement.",
    href: "/companies/dashboard/requirements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "n6",
    type: "engagement_ended",
    title: "Engagement completed",
    description:
      "The contract engagement with Sofia K. has ended. Consider leaving a review.",
    href: "/companies/dashboard/engagements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "n7",
    type: "requirement_update",
    title: "Requirement status updated",
    description:
      'Your "Mobile App Developer" requirement has been moved to matching.',
    href: "/companies/dashboard/requirements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "n8",
    type: "system",
    title: "Welcome to OctogleHire",
    description:
      "Complete your company profile and post your first requirement to get started.",
    href: "/companies/dashboard/settings",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];
