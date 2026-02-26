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

export type CompanyStatus = "pending" | "contacted" | "active" | "inactive";

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
  pending: "Pending",
  contacted: "Contacted",
  active: "Active",
  inactive: "Inactive",
};

export const companyStatusBadgeClass = (status: CompanyStatus) => {
  switch (status) {
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
