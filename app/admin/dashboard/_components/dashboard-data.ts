// ── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "draft"
  | "hr_communication_round"
  | "ai_technical_examination"
  | "tech_lead_human_interview"
  | "background_previous_company_checks"
  | "offer_extended"
  | "offer_declined"
  | "approved"
  | "rejected";

export type CompanyStatus = "enquired" | "pending" | "contacted" | "active" | "inactive";

export type RequirementStatus =
  | "open"
  | "matching"
  | "partially_filled"
  | "filled"
  | "closed";

export type MatchStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "active"
  | "ended";

// ── Pipeline stages (ordered) ────────────────────────────────────────────────

export const PIPELINE_STAGES: ApplicationStatus[] = [
  "draft",
  "hr_communication_round",
  "ai_technical_examination",
  "tech_lead_human_interview",
  "background_previous_company_checks",
  "offer_extended",
  "approved",
];

export const ALL_STATUSES: ApplicationStatus[] = [
  ...PIPELINE_STAGES,
  "offer_declined",
  "rejected",
];

// ── Status display helpers ───────────────────────────────────────────────────

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  draft: "Draft",
  hr_communication_round: "HR Communication",
  ai_technical_examination: "AI Technical Exam",
  tech_lead_human_interview: "Tech Lead Interview",
  background_previous_company_checks: "Background Checks",
  offer_extended: "Offer Extended",
  offer_declined: "Offer Declined",
  approved: "Approved",
  rejected: "Rejected",
};

export const applicationStatusBadgeClass = (status: ApplicationStatus) => {
  switch (status) {
    case "draft":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    case "hr_communication_round":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "ai_technical_examination":
      return "bg-violet-500/10 text-violet-600 border-violet-600/20";
    case "tech_lead_human_interview":
      return "bg-sky-500/10 text-sky-600 border-sky-600/20";
    case "background_previous_company_checks":
      return "bg-orange-500/10 text-orange-600 border-orange-600/20";
    case "offer_extended":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
    case "offer_declined":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export const companyStatusLabel: Record<CompanyStatus, string> = {
  enquired: "Enquired",
  pending: "Pending",
  contacted: "Contacted",
  active: "Active",
  inactive: "Inactive",
};

export const companyStatusBadgeClass = (status: CompanyStatus) => {
  switch (status) {
    case "enquired":
      return "bg-violet-500/10 text-violet-600 border-violet-600/20";
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "inactive":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    case "contacted":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    default:
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
  }
};

// ── Requirement status helpers ───────────────────────────────────────────────

export const requirementStatusLabel: Record<RequirementStatus, string> = {
  open: "Open",
  matching: "Matching",
  partially_filled: "Partially Filled",
  filled: "Filled",
  closed: "Closed",
};

export const requirementStatusBadgeClass = (status: RequirementStatus) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "matching":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "partially_filled":
      return "bg-violet-500/10 text-violet-600 border-violet-600/20";
    case "filled":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "closed":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export const matchStatusLabel: Record<MatchStatus, string> = {
  proposed: "Proposed",
  accepted: "Accepted",
  rejected: "Rejected",
  active: "Active",
  ended: "Ended",
};

export const matchStatusBadgeClass = (status: MatchStatus) => {
  switch (status) {
    case "proposed":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "accepted":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "ended":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export const priorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const priorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "high":
      return "bg-orange-500/10 text-orange-600 border-orange-600/20";
    case "medium":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

// ── Time entry status helpers ────────────────────────────────────────────────

export type TimeEntryStatus = "submitted" | "approved" | "rejected";

export const timeEntryStatusLabel: Record<TimeEntryStatus, string> = {
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export const timeEntryStatusBadgeClass = (status: TimeEntryStatus) => {
  switch (status) {
    case "submitted":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

// ── Invoice status helpers ──────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const invoiceStatusBadgeClass = (status: InvoiceStatus) => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "sent":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "overdue":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "draft":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    case "cancelled":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

// ── Payout status helpers ─────────────────────────────────────────────────

export type PayoutStatus = "pending" | "approved" | "processing" | "paid" | "cancelled";

export const payoutStatusLabel: Record<PayoutStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  processing: "Processing",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const payoutStatusBadgeClass = (status: PayoutStatus) => {
  switch (status) {
    case "paid":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "approved":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "processing":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "pending":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD",
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

// ── Helpers ──────────────────────────────────────────────────────────────────

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getNextStatus = (
  current: ApplicationStatus,
): ApplicationStatus | null => {
  const idx = PIPELINE_STAGES.indexOf(current);
  if (idx === -1 || idx >= PIPELINE_STAGES.length - 1) return null;
  return PIPELINE_STAGES[idx + 1];
};
