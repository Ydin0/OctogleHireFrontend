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
  | "rejected"
  | "prospected"
  | "contacted"
  | "interviewing";

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
  | "interview_requested"
  | "interview_scheduled"
  | "declined"
  | "rejected"
  | "active"
  | "ended";

export type InterviewStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "declined"
  | "rescheduled";

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
  prospected: "Prospected",
  contacted: "Contacted",
  interviewing: "Interviewing",
};

export const applicationStatusBadgeClass = (status: ApplicationStatus) => {
  switch (status) {
    case "draft":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    case "hr_communication_round":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "ai_technical_examination":
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    case "tech_lead_human_interview":
      return "bg-sky-500/8 text-sky-500 border-sky-500/15";
    case "background_previous_company_checks":
      return "bg-orange-500/8 text-orange-500 border-orange-500/15";
    case "offer_extended":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "approved":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "rejected":
    case "offer_declined":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "prospected":
      return "bg-teal-500/8 text-teal-500 border-teal-500/15";
    case "contacted":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "interviewing":
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
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
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    case "active":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "inactive":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    case "contacted":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    default:
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
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

export const requirementStatusBadgeClass = (_status: RequirementStatus) =>
  "bg-transparent text-muted-foreground border-border";

export const matchStatusLabel: Record<MatchStatus, string> = {
  proposed: "Proposed",
  accepted: "Applicant Accepted",
  interview_requested: "Interview Requested",
  interview_scheduled: "Interview Scheduled",
  declined: "Declined",
  rejected: "Rejected",
  active: "Active",
  ended: "Ended",
};

export const matchStatusBadgeClass = (status: MatchStatus) => {
  switch (status) {
    case "proposed":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "accepted":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "interview_requested":
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    case "interview_scheduled":
      return "bg-sky-500/8 text-sky-500 border-sky-500/15";
    case "declined":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "active":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "rejected":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "ended":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

export const interviewStatusLabel: Record<InterviewStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  declined: "Declined",
  rescheduled: "Rescheduled",
};

export const interviewStatusBadgeClass = (status: InterviewStatus) => {
  switch (status) {
    case "requested":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "confirmed":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "completed":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "declined":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "rescheduled":
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

export const priorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const priorityBadgeClass = (_priority: string) =>
  "bg-transparent text-muted-foreground border-border";

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
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "approved":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "rejected":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
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
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "sent":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "overdue":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "draft":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    case "cancelled":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
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
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "approved":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    case "processing":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "pending":
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
    case "cancelled":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

// ── Change request status helpers ───────────────────────────────────────────

export type ChangeRequestType = "cancellation" | "hour_reduction" | "extension";
export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export const changeRequestTypeLabel: Record<ChangeRequestType, string> = {
  cancellation: "Cancellation",
  hour_reduction: "Hour Reduction",
  extension: "Extension",
};

export const changeRequestTypeBadgeClass = (type: ChangeRequestType) => {
  switch (type) {
    case "cancellation":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "hour_reduction":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "extension":
      return "bg-blue-500/8 text-blue-500 border-blue-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

export const changeRequestStatusLabel: Record<ChangeRequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const changeRequestStatusBadgeClass = (status: ChangeRequestStatus) => {
  switch (status) {
    case "pending":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "approved":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "rejected":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
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
