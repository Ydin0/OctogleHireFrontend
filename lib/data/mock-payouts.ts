import type { PayoutStatus } from "@/app/admin/dashboard/_components/dashboard-data";

// ── Types ────────────────────────────────────────────────────────────────────

export interface MockPayoutLineItem {
  id: string;
  companyId: string;
  companyName: string;
  requirementTitle: string;
  developerPayoutRate: number;
  companyBillingRate: number;
  hoursWorked: number;
  payoutAmount: number;
  billingAmount: number;
  margin: number;
}

export interface MockPayout {
  id: string;
  payoutNumber: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  periodStart: string;
  periodEnd: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: PayoutStatus;
  lineItems: MockPayoutLineItem[];
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockPayoutSummary {
  totalPayouts: number;
  totalPaidOut: number;
  totalPending: number;
  totalBilledToCompanies: number;
  totalMargin: number;
  averageMarginPercent: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockPayouts: MockPayout[] = [
  // ── Dec 2025 ──────────────────────────────────────────────────────────────
  {
    id: "pay-1",
    payoutNumber: "PAY-2025-001",
    developerId: "mei-lin-chen",
    developerName: "Mei-Lin Chen",
    developerEmail: "mei-lin@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2025-12-01",
    periodEnd: "2025-12-31",
    currency: "USD",
    subtotal: 10400,
    taxRate: 0,
    taxAmount: 0,
    total: 10400,
    status: "paid",
    paidAt: "2026-01-30T14:00:00Z",
    lineItems: [
      {
        id: "pli-1",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 65,
        companyBillingRate: 88,
        hoursWorked: 160,
        payoutAmount: 10400,
        billingAmount: 14080,
        margin: 3680,
      },
    ],
    createdAt: "2026-01-02T09:00:00Z",
    updatedAt: "2026-01-30T14:00:00Z",
  },
  {
    id: "pay-2",
    payoutNumber: "PAY-2025-002",
    developerId: "alex-petrov",
    developerName: "Alex Petrov",
    developerEmail: "alex@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2025-12-01",
    periodEnd: "2025-12-31",
    currency: "USD",
    subtotal: 8800,
    taxRate: 0,
    taxAmount: 0,
    total: 8800,
    status: "paid",
    paidAt: "2026-01-30T14:00:00Z",
    lineItems: [
      {
        id: "pli-2",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 55,
        companyBillingRate: 76,
        hoursWorked: 160,
        payoutAmount: 8800,
        billingAmount: 12160,
        margin: 3360,
      },
    ],
    createdAt: "2026-01-02T09:00:00Z",
    updatedAt: "2026-01-30T14:00:00Z",
  },

  // ── Jan 2026 ──────────────────────────────────────────────────────────────
  {
    id: "pay-3",
    payoutNumber: "PAY-2026-001",
    developerId: "mei-lin-chen",
    developerName: "Mei-Lin Chen",
    developerEmail: "mei-lin@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    currency: "USD",
    subtotal: 10400,
    taxRate: 0,
    taxAmount: 0,
    total: 10400,
    status: "paid",
    paidAt: "2026-02-27T10:00:00Z",
    lineItems: [
      {
        id: "pli-3",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 65,
        companyBillingRate: 88,
        hoursWorked: 160,
        payoutAmount: 10400,
        billingAmount: 14080,
        margin: 3680,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "pay-4",
    payoutNumber: "PAY-2026-002",
    developerId: "alex-petrov",
    developerName: "Alex Petrov",
    developerEmail: "alex@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    currency: "USD",
    subtotal: 8800,
    taxRate: 0,
    taxAmount: 0,
    total: 8800,
    status: "paid",
    paidAt: "2026-02-27T10:00:00Z",
    lineItems: [
      {
        id: "pli-4",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 55,
        companyBillingRate: 76,
        hoursWorked: 160,
        payoutAmount: 8800,
        billingAmount: 12160,
        margin: 3360,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "pay-5",
    payoutNumber: "PAY-2026-003",
    developerId: "aisha-hassan",
    developerName: "Aisha Hassan",
    developerEmail: "aisha@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    currency: "USD",
    subtotal: 8320,
    taxRate: 0,
    taxAmount: 0,
    total: 8320,
    status: "paid",
    paidAt: "2026-02-27T10:00:00Z",
    lineItems: [
      {
        id: "pli-5",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 52,
        companyBillingRate: 72,
        hoursWorked: 160,
        payoutAmount: 8320,
        billingAmount: 11520,
        margin: 3200,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "pay-6",
    payoutNumber: "PAY-2026-004",
    developerId: "sofia-martinez",
    developerName: "Sofia Martinez",
    developerEmail: "sofia@octoglehire.com",
    developerRole: "Senior React Engineer",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    currency: "USD",
    subtotal: 9600,
    taxRate: 0,
    taxAmount: 0,
    total: 9600,
    status: "paid",
    paidAt: "2026-02-22T16:00:00Z",
    lineItems: [
      {
        id: "pli-6",
        companyId: "company-1",
        companyName: "Nexora Technologies",
        requirementTitle: "Senior React Engineers for Dashboard Rebuild",
        developerPayoutRate: 60,
        companyBillingRate: 80,
        hoursWorked: 160,
        payoutAmount: 9600,
        billingAmount: 12800,
        margin: 3200,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-22T16:00:00Z",
  },
  {
    id: "pay-7",
    payoutNumber: "PAY-2026-005",
    developerId: "david-kimani",
    developerName: "David Kimani",
    developerEmail: "david@octoglehire.com",
    developerRole: "Full Stack Node.js Developer",
    periodStart: "2026-01-01",
    periodEnd: "2026-01-31",
    currency: "USD",
    subtotal: 9920,
    taxRate: 0,
    taxAmount: 0,
    total: 9920,
    status: "paid",
    paidAt: "2026-02-22T16:00:00Z",
    lineItems: [
      {
        id: "pli-7",
        companyId: "company-1",
        companyName: "Nexora Technologies",
        requirementTitle: "Full Stack Node.js Developer",
        developerPayoutRate: 62,
        companyBillingRate: 85,
        hoursWorked: 160,
        payoutAmount: 9920,
        billingAmount: 13600,
        margin: 3680,
      },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-22T16:00:00Z",
  },

  // ── Feb 2026 ──────────────────────────────────────────────────────────────
  {
    id: "pay-8",
    payoutNumber: "PAY-2026-006",
    developerId: "mei-lin-chen",
    developerName: "Mei-Lin Chen",
    developerEmail: "mei-lin@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    currency: "USD",
    subtotal: 10400,
    taxRate: 0,
    taxAmount: 0,
    total: 10400,
    status: "approved",
    lineItems: [
      {
        id: "pli-8",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 65,
        companyBillingRate: 88,
        hoursWorked: 160,
        payoutAmount: 10400,
        billingAmount: 14080,
        margin: 3680,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "pay-9",
    payoutNumber: "PAY-2026-007",
    developerId: "alex-petrov",
    developerName: "Alex Petrov",
    developerEmail: "alex@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    currency: "USD",
    subtotal: 8800,
    taxRate: 0,
    taxAmount: 0,
    total: 8800,
    status: "approved",
    lineItems: [
      {
        id: "pli-9",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 55,
        companyBillingRate: 76,
        hoursWorked: 160,
        payoutAmount: 8800,
        billingAmount: 12160,
        margin: 3360,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "pay-10",
    payoutNumber: "PAY-2026-008",
    developerId: "aisha-hassan",
    developerName: "Aisha Hassan",
    developerEmail: "aisha@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    currency: "USD",
    subtotal: 8320,
    taxRate: 0,
    taxAmount: 0,
    total: 8320,
    status: "pending",
    lineItems: [
      {
        id: "pli-10",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 52,
        companyBillingRate: 72,
        hoursWorked: 160,
        payoutAmount: 8320,
        billingAmount: 11520,
        margin: 3200,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "pay-11",
    payoutNumber: "PAY-2026-009",
    developerId: "sofia-martinez",
    developerName: "Sofia Martinez",
    developerEmail: "sofia@octoglehire.com",
    developerRole: "Senior React Engineer",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    currency: "USD",
    subtotal: 9600,
    taxRate: 0,
    taxAmount: 0,
    total: 9600,
    status: "processing",
    lineItems: [
      {
        id: "pli-11",
        companyId: "company-1",
        companyName: "Nexora Technologies",
        requirementTitle: "Senior React Engineers for Dashboard Rebuild",
        developerPayoutRate: 60,
        companyBillingRate: 80,
        hoursWorked: 160,
        payoutAmount: 9600,
        billingAmount: 12800,
        margin: 3200,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "pay-12",
    payoutNumber: "PAY-2026-010",
    developerId: "david-kimani",
    developerName: "David Kimani",
    developerEmail: "david@octoglehire.com",
    developerRole: "Full Stack Node.js Developer",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    currency: "USD",
    subtotal: 9920,
    taxRate: 0,
    taxAmount: 0,
    total: 9920,
    status: "processing",
    lineItems: [
      {
        id: "pli-12",
        companyId: "company-1",
        companyName: "Nexora Technologies",
        requirementTitle: "Full Stack Node.js Developer",
        developerPayoutRate: 62,
        companyBillingRate: 85,
        hoursWorked: 160,
        payoutAmount: 9920,
        billingAmount: 13600,
        margin: 3680,
      },
    ],
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },

  // ── Mar 2026 ──────────────────────────────────────────────────────────────
  {
    id: "pay-13",
    payoutNumber: "PAY-2026-011",
    developerId: "mei-lin-chen",
    developerName: "Mei-Lin Chen",
    developerEmail: "mei-lin@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    currency: "USD",
    subtotal: 10400,
    taxRate: 0,
    taxAmount: 0,
    total: 10400,
    status: "pending",
    lineItems: [
      {
        id: "pli-13",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 65,
        companyBillingRate: 88,
        hoursWorked: 160,
        payoutAmount: 10400,
        billingAmount: 14080,
        margin: 3680,
      },
    ],
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-03-28T09:00:00Z",
  },
  {
    id: "pay-14",
    payoutNumber: "PAY-2026-012",
    developerId: "alex-petrov",
    developerName: "Alex Petrov",
    developerEmail: "alex@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    currency: "USD",
    subtotal: 8800,
    taxRate: 0,
    taxAmount: 0,
    total: 8800,
    status: "pending",
    lineItems: [
      {
        id: "pli-14",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 55,
        companyBillingRate: 76,
        hoursWorked: 160,
        payoutAmount: 8800,
        billingAmount: 12160,
        margin: 3360,
      },
    ],
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-03-28T09:00:00Z",
  },
  {
    id: "pay-15",
    payoutNumber: "PAY-2026-013",
    developerId: "aisha-hassan",
    developerName: "Aisha Hassan",
    developerEmail: "aisha@octoglehire.com",
    developerRole: "Backend Python Engineer",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    currency: "USD",
    subtotal: 8320,
    taxRate: 0,
    taxAmount: 0,
    total: 8320,
    status: "pending",
    lineItems: [
      {
        id: "pli-15",
        companyId: "company-2",
        companyName: "Verdant Health",
        requirementTitle: "Backend Python Engineers",
        developerPayoutRate: 52,
        companyBillingRate: 72,
        hoursWorked: 160,
        payoutAmount: 8320,
        billingAmount: 11520,
        margin: 3200,
      },
    ],
    createdAt: "2026-03-28T09:00:00Z",
    updatedAt: "2026-03-28T09:00:00Z",
  },
];

// ── Getters ──────────────────────────────────────────────────────────────────

export function getMockPayouts(): MockPayout[] {
  return mockPayouts;
}

export function getMockPayoutById(id: string): MockPayout | undefined {
  return mockPayouts.find((p) => p.id === id);
}

export function getMockPayoutsByDeveloperId(developerId: string): MockPayout[] {
  return mockPayouts.filter((p) => p.developerId === developerId);
}

export function getMockPayoutSummary(): MockPayoutSummary {
  const paid = mockPayouts.filter((p) => p.status === "paid");
  const pending = mockPayouts.filter(
    (p) => p.status === "pending" || p.status === "approved" || p.status === "processing",
  );

  const totalPaidOut = paid.reduce((sum, p) => sum + p.total, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.total, 0);

  const totalBilledToCompanies = mockPayouts.reduce(
    (sum, p) => sum + p.lineItems.reduce((s, li) => s + li.billingAmount, 0),
    0,
  );
  const totalPayoutAmount = mockPayouts.reduce((sum, p) => sum + p.total, 0);
  const totalMargin = totalBilledToCompanies - totalPayoutAmount;
  const averageMarginPercent =
    totalBilledToCompanies > 0
      ? (totalMargin / totalBilledToCompanies) * 100
      : 0;

  return {
    totalPayouts: mockPayouts.length,
    totalPaidOut,
    totalPending,
    totalBilledToCompanies,
    totalMargin,
    averageMarginPercent,
  };
}

export function getMockDeveloperPayoutSummary(
  developerId: string,
): MockPayoutSummary {
  const devPayouts = getMockPayoutsByDeveloperId(developerId);
  const paid = devPayouts.filter((p) => p.status === "paid");
  const pending = devPayouts.filter(
    (p) => p.status === "pending" || p.status === "approved" || p.status === "processing",
  );

  const totalPaidOut = paid.reduce((sum, p) => sum + p.total, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.total, 0);

  const totalBilledToCompanies = devPayouts.reduce(
    (sum, p) => sum + p.lineItems.reduce((s, li) => s + li.billingAmount, 0),
    0,
  );
  const totalPayoutAmount = devPayouts.reduce((sum, p) => sum + p.total, 0);
  const totalMargin = totalBilledToCompanies - totalPayoutAmount;
  const averageMarginPercent =
    totalBilledToCompanies > 0
      ? (totalMargin / totalBilledToCompanies) * 100
      : 0;

  return {
    totalPayouts: devPayouts.length,
    totalPaidOut,
    totalPending,
    totalBilledToCompanies,
    totalMargin,
    averageMarginPercent,
  };
}
