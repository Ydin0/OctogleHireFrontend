import type { InvoiceStatus } from "@/app/admin/dashboard/_components/dashboard-data";

// ── Types ────────────────────────────────────────────────────────────────────

export interface MockInvoiceLineItem {
  id: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  requirementTitle: string;
  hourlyRate: number;
  hoursWorked: number;
  amount: number;
}

export interface MockInvoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  lineItems: MockInvoiceLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockInvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockInvoices: MockInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2025-001",
    companyId: "company-2",
    companyName: "Verdant Health",
    companyEmail: "marcus@verdanthealth.com",
    periodStart: "2025-12-01",
    periodEnd: "2025-12-31",
    issuedAt: "2026-01-02T09:00:00Z",
    dueDate: "2026-02-01",
    paidAt: "2026-01-28T14:30:00Z",
    currency: "USD",
    subtotal: 26240,
    taxRate: 0,
    taxAmount: 0,
    total: 26240,
    status: "paid",
    lineItems: [
      {
        id: "li-1",
        developerId: "mei-lin-chen",
        developerName: "Mei-Lin Chen",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 88,
        hoursWorked: 160,
        amount: 14080,
      },
      {
        id: "li-2",
        developerId: "alex-petrov",
        developerName: "Alex Petrov",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 76,
        hoursWorked: 160,
        amount: 12160,
      },
    ],
    createdAt: "2026-01-02T09:00:00Z",
    updatedAt: "2026-01-28T14:30:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-001",
    companyId: "company-2",
    companyName: "Verdant Health",
    companyEmail: "marcus@verdanthealth.com",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    issuedAt: "2026-02-01T09:00:00Z",
    dueDate: "2026-03-03",
    paidAt: "2026-02-25T10:00:00Z",
    currency: "USD",
    subtotal: 37920,
    taxRate: 0,
    taxAmount: 0,
    total: 37920,
    status: "paid",
    lineItems: [
      {
        id: "li-3",
        developerId: "mei-lin-chen",
        developerName: "Mei-Lin Chen",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 88,
        hoursWorked: 160,
        amount: 14080,
      },
      {
        id: "li-4",
        developerId: "alex-petrov",
        developerName: "Alex Petrov",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 76,
        hoursWorked: 160,
        amount: 12160,
      },
      {
        id: "li-5",
        developerId: "aisha-hassan",
        developerName: "Aisha Hassan",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 72,
        hoursWorked: 160,
        amount: 11520,
      },
    ],
    notes: "Three developers active this billing period.",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-002",
    companyId: "company-1",
    companyName: "Nexora Technologies",
    companyEmail: "sarah@nexora.io",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    issuedAt: "2026-02-01T09:00:00Z",
    dueDate: "2026-03-03",
    paidAt: "2026-02-20T16:00:00Z",
    currency: "USD",
    subtotal: 26400,
    taxRate: 0,
    taxAmount: 0,
    total: 26400,
    status: "paid",
    lineItems: [
      {
        id: "li-6",
        developerId: "sofia-martinez",
        developerName: "Sofia Martinez",
        developerRole: "Senior React Engineer",
        requirementTitle: "Senior React Engineers for Dashboard Rebuild",
        hourlyRate: 80,
        hoursWorked: 160,
        amount: 12800,
      },
      {
        id: "li-7",
        developerId: "david-kimani",
        developerName: "David Kimani",
        developerRole: "Full Stack Node.js Developer",
        requirementTitle: "Full Stack Node.js Developer",
        hourlyRate: 85,
        hoursWorked: 160,
        amount: 13600,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-20T16:00:00Z",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-003",
    companyId: "company-2",
    companyName: "Verdant Health",
    companyEmail: "marcus@verdanthealth.com",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    issuedAt: "2026-03-01T09:00:00Z",
    dueDate: "2026-03-31",
    currency: "USD",
    subtotal: 37920,
    taxRate: 0,
    taxAmount: 0,
    total: 37920,
    status: "overdue",
    lineItems: [
      {
        id: "li-8",
        developerId: "mei-lin-chen",
        developerName: "Mei-Lin Chen",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 88,
        hoursWorked: 160,
        amount: 14080,
      },
      {
        id: "li-9",
        developerId: "alex-petrov",
        developerName: "Alex Petrov",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 76,
        hoursWorked: 160,
        amount: 12160,
      },
      {
        id: "li-10",
        developerId: "aisha-hassan",
        developerName: "Aisha Hassan",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 72,
        hoursWorked: 160,
        amount: 11520,
      },
    ],
    notes: "Payment overdue — follow up with Marcus.",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-004",
    companyId: "company-1",
    companyName: "Nexora Technologies",
    companyEmail: "sarah@nexora.io",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    issuedAt: "2026-03-01T09:00:00Z",
    dueDate: "2026-03-31",
    currency: "USD",
    subtotal: 26400,
    taxRate: 0,
    taxAmount: 0,
    total: 26400,
    status: "sent",
    lineItems: [
      {
        id: "li-11",
        developerId: "sofia-martinez",
        developerName: "Sofia Martinez",
        developerRole: "Senior React Engineer",
        requirementTitle: "Senior React Engineers for Dashboard Rebuild",
        hourlyRate: 80,
        hoursWorked: 160,
        amount: 12800,
      },
      {
        id: "li-12",
        developerId: "david-kimani",
        developerName: "David Kimani",
        developerRole: "Full Stack Node.js Developer",
        requirementTitle: "Full Stack Node.js Developer",
        hourlyRate: 85,
        hoursWorked: 160,
        amount: 13600,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "inv-6",
    invoiceNumber: "INV-2026-005",
    companyId: "company-2",
    companyName: "Verdant Health",
    companyEmail: "marcus@verdanthealth.com",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    issuedAt: "2026-03-28T09:00:00Z",
    dueDate: "2026-04-27",
    currency: "USD",
    subtotal: 37920,
    taxRate: 0,
    taxAmount: 0,
    total: 37920,
    status: "draft",
    lineItems: [
      {
        id: "li-13",
        developerId: "mei-lin-chen",
        developerName: "Mei-Lin Chen",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 88,
        hoursWorked: 160,
        amount: 14080,
      },
      {
        id: "li-14",
        developerId: "alex-petrov",
        developerName: "Alex Petrov",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 76,
        hoursWorked: 160,
        amount: 12160,
      },
      {
        id: "li-15",
        developerId: "aisha-hassan",
        developerName: "Aisha Hassan",
        developerRole: "Backend Python Engineer",
        requirementTitle: "Backend Python Engineers",
        hourlyRate: 72,
        hoursWorked: 160,
        amount: 11520,
      },
    ],
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-03-28T09:00:00Z",
  },
];

// ── Getters ──────────────────────────────────────────────────────────────────

export function getMockInvoices(): MockInvoice[] {
  return mockInvoices;
}

export function getMockInvoiceById(id: string): MockInvoice | undefined {
  return mockInvoices.find((inv) => inv.id === id);
}

export function getMockInvoicesByCompanyId(companyId: string): MockInvoice[] {
  return mockInvoices.filter((inv) => inv.companyId === companyId);
}

export function getMockInvoiceSummary(): MockInvoiceSummary {
  const paid = mockInvoices.filter((inv) => inv.status === "paid");
  const outstanding = mockInvoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue",
  );
  const overdue = mockInvoices.filter((inv) => inv.status === "overdue");

  return {
    totalInvoices: mockInvoices.length,
    totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
    totalPaid: paid.reduce((sum, inv) => sum + inv.total, 0),
    totalOutstanding: outstanding.reduce((sum, inv) => sum + inv.total, 0),
    overdueCount: overdue.length,
  };
}

export function getMockCompanyInvoiceSummary(
  companyId: string,
): MockInvoiceSummary {
  const companyInvoices = getMockInvoicesByCompanyId(companyId);
  const paid = companyInvoices.filter((inv) => inv.status === "paid");
  const outstanding = companyInvoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue",
  );
  const overdue = companyInvoices.filter((inv) => inv.status === "overdue");

  return {
    totalInvoices: companyInvoices.length,
    totalRevenue: companyInvoices.reduce((sum, inv) => sum + inv.total, 0),
    totalPaid: paid.reduce((sum, inv) => sum + inv.total, 0),
    totalOutstanding: outstanding.reduce((sum, inv) => sum + inv.total, 0),
    overdueCount: overdue.length,
  };
}
