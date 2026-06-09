"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  MessageSquare,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface OpenWork {
  openRequirements: number;
  pendingApprovals: number;
  pendingReviews: number;
  pendingEnquiries: number;
}

interface OpenWorkCardProps {
  data: OpenWork;
}

/** Single card listing the four "things waiting on you" counts, each
 *  linking out to its own page. Intentionally compact so it can live in
 *  the right column next to the source donut. */
export function OpenWorkCard({ data }: OpenWorkCardProps) {
  const rows = [
    {
      key: "requirements",
      label: "Open requirements",
      count: data.openRequirements,
      icon: FileText,
      href: "/admin/dashboard/requirements?status=open,matching",
    },
    {
      key: "approvals",
      label: "Pending approvals",
      count: data.pendingApprovals,
      icon: ClipboardList,
      href: "/admin/dashboard/approvals",
    },
    {
      key: "reviews",
      label: "Reviews to moderate",
      count: data.pendingReviews,
      icon: MessageSquare,
      href: "/admin/dashboard/reviews?tab=pending",
    },
    {
      key: "enquiries",
      label: "New company enquiries",
      count: data.pendingEnquiries,
      icon: Building2,
      href: "/admin/dashboard/companies?tab=enquiries",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Open work
        </p>
        <ul className="mt-3 space-y-1">
          {rows.map(({ key, label, count, icon: Icon, href }) => (
            <li key={key}>
              <Link
                href={href}
                className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2 text-sm">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {label}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono tabular-nums">{count}</span>
                  <ArrowRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
