import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Globe2,
  Receipt,
  Users,
} from "lucide-react";

export type InvoiceStatus = "paid" | "pending" | "overdue";

export type CompanyKpi = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
};

export type Invoice = {
  id: string;
  developerName: string;
  project: string;
  amount: number;
  issuedOn: string;
  dueOn: string;
  status: InvoiceStatus;
};

export type Squad = {
  name: string;
  lead: string;
  activePeople: number;
  allocation: number;
  deliveryHealth: "healthy" | "watch";
  budgetUsed: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  engagementType: "Hourly" | "Monthly" | "Project-Based";
  hourlyRate: number;
  monthlyRate: number;
  projectRate: number;
  utilization: number;
  timezoneOverlapHours: number;
  invoiceStatus: InvoiceStatus;
};

export const companyProfile = {
  name: "Acme Product Team",
  adminInitials: "AM",
  adminAvatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
};

export const kpis: CompanyKpi[] = [
  {
    label: "Active Offshore Developers",
    value: "18",
    hint: "Across 5 delivery squads",
    icon: Users,
  },
  {
    label: "Open Invoices",
    value: "11",
    hint: "4 due in the next 7 days",
    icon: Receipt,
  },
  {
    label: "Avg Timezone Overlap",
    value: "4.8h",
    hint: "US and EU leadership coverage",
    icon: Globe2,
  },
  {
    label: "High Allocation Risk",
    value: "3",
    hint: "Contributors over 90% utilization",
    icon: AlertTriangle,
  },
];

export const invoices: Invoice[] = [
  {
    id: "INV-1458",
    developerName: "Sofia Patel",
    project: "Client Dashboard Revamp",
    amount: 4200,
    issuedOn: "2026-02-01",
    dueOn: "2026-02-15",
    status: "pending",
  },
  {
    id: "INV-1453",
    developerName: "Rahul Menon",
    project: "API Platform Migration",
    amount: 5600,
    issuedOn: "2026-01-28",
    dueOn: "2026-02-11",
    status: "overdue",
  },
  {
    id: "INV-1447",
    developerName: "Ana Costa",
    project: "Checkout Optimization",
    amount: 3600,
    issuedOn: "2026-01-25",
    dueOn: "2026-02-08",
    status: "paid",
  },
  {
    id: "INV-1441",
    developerName: "Nabil Hassan",
    project: "Infrastructure Hardening",
    amount: 4900,
    issuedOn: "2026-01-20",
    dueOn: "2026-02-05",
    status: "paid",
  },
  {
    id: "INV-1439",
    developerName: "Maya Singh",
    project: "Growth Analytics",
    amount: 3200,
    issuedOn: "2026-01-18",
    dueOn: "2026-02-02",
    status: "pending",
  },
];

export const squads: Squad[] = [
  {
    name: "Core Product",
    lead: "Sofia Patel",
    activePeople: 6,
    allocation: 92,
    deliveryHealth: "healthy",
    budgetUsed: 78,
  },
  {
    name: "Data and Integrations",
    lead: "Rahul Menon",
    activePeople: 4,
    allocation: 84,
    deliveryHealth: "watch",
    budgetUsed: 91,
  },
  {
    name: "Growth Squad",
    lead: "Maya Singh",
    activePeople: 5,
    allocation: 88,
    deliveryHealth: "healthy",
    budgetUsed: 72,
  },
  {
    name: "Platform Reliability",
    lead: "Nabil Hassan",
    activePeople: 3,
    allocation: 76,
    deliveryHealth: "healthy",
    budgetUsed: 67,
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "tm-sofia",
    name: "Sofia Patel",
    role: "Frontend Lead",
    location: "Bangalore, IN",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    engagementType: "Monthly",
    hourlyRate: 82,
    monthlyRate: 13120,
    projectRate: 18500,
    utilization: 95,
    timezoneOverlapHours: 5.5,
    invoiceStatus: "pending",
  },
  {
    id: "tm-rahul",
    name: "Rahul Menon",
    role: "Backend Lead",
    location: "Kochi, IN",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    engagementType: "Project-Based",
    hourlyRate: 96,
    monthlyRate: 15360,
    projectRate: 22000,
    utilization: 90,
    timezoneOverlapHours: 4.5,
    invoiceStatus: "overdue",
  },
  {
    id: "tm-maya",
    name: "Maya Singh",
    role: "Data Engineer",
    location: "Pune, IN",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    engagementType: "Hourly",
    hourlyRate: 74,
    monthlyRate: 11840,
    projectRate: 16200,
    utilization: 82,
    timezoneOverlapHours: 4,
    invoiceStatus: "paid",
  },
  {
    id: "tm-ana",
    name: "Ana Costa",
    role: "Product Designer",
    location: "Lisbon, PT",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    engagementType: "Monthly",
    hourlyRate: 78,
    monthlyRate: 12480,
    projectRate: 17600,
    utilization: 74,
    timezoneOverlapHours: 6.5,
    invoiceStatus: "paid",
  },
  {
    id: "tm-nabil",
    name: "Nabil Hassan",
    role: "DevOps Engineer",
    location: "Cairo, EG",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    engagementType: "Project-Based",
    hourlyRate: 89,
    monthlyRate: 14240,
    projectRate: 20500,
    utilization: 88,
    timezoneOverlapHours: 6,
    invoiceStatus: "pending",
  },
  {
    id: "tm-leena",
    name: "Leena Roy",
    role: "QA Engineer",
    location: "Hyderabad, IN",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    engagementType: "Hourly",
    hourlyRate: 58,
    monthlyRate: 9280,
    projectRate: 12800,
    utilization: 79,
    timezoneOverlapHours: 5,
    invoiceStatus: "pending",
  },
];

export const timezoneCoverage = [
  { region: "US Team Overlap", hours: "4.2 hrs/day", score: 70 },
  { region: "EU Team Overlap", hours: "6.1 hrs/day", score: 92 },
  { region: "Support Handoffs", hours: "14 per week", score: 78 },
];

export const alerts = [
  "INV-1453 is overdue by 3 days.",
  "Data and Integrations squad is above 90% budget utilization.",
  "Two contractor agreements renew in the next 10 days.",
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const invoiceStatusBadgeClass = (status: InvoiceStatus) => {
  if (status === "paid") {
    return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
  }

  if (status === "overdue") {
    return "bg-red-500/10 text-red-600 border-red-600/20";
  }

  return "bg-amber-500/10 text-amber-700 border-amber-600/20";
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
