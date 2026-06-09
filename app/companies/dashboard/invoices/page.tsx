"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Coins,
  Download,
  Loader2,
  Receipt,
} from "lucide-react";

import {
  type CompanyInvoice,
  type CompanyInvoiceSummary,
  fetchCompanyInvoices,
  fetchCompanyInvoiceSummaryData,
} from "@/lib/api/companies";
import { formatCurrency, formatDate } from "@/app/admin/dashboard/_components/dashboard-data";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  Mono,
  PageHead,
  PageScroll,
  StatusPill,
  SummaryStat,
} from "../_components/console-ui";

function InvoiceRow({ inv }: { inv: CompanyInvoice }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[20px_1.4fr_1fr_1fr_auto] items-center gap-3 px-1 py-3.5 text-left"
      >
        <ChevronRight
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
        <span>
          <span className="font-mono text-[13.5px] font-semibold">{inv.invoiceNumber}</span>
          <span className="block text-[11.5px] text-muted-foreground">
            {formatDate(inv.periodStart)} – {formatDate(inv.periodEnd)}
          </span>
        </span>
        <span className="text-[12.5px] text-muted-foreground">
          {inv.issuedAt ? formatDate(inv.issuedAt) : "—"}
        </span>
        <span className="font-mono text-sm font-semibold">
          {formatCurrency(inv.total, inv.currency)}
        </span>
        <span className="inline-flex items-center gap-3 justify-self-end">
          <StatusPill status={inv.status} />
          <Download className="size-3.5 text-muted-foreground" />
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-1 pb-4 pl-9">
          {inv.lineItems.map((li) => (
            <div key={li.id} className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">
                {li.developerName} · {li.requirementTitle || "EOR + payroll"}
              </span>
              <span className="font-mono">{formatCurrency(li.amount, inv.currency)}</span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-2">
            <a
              href={`/api/invoices/${inv.id}/pdf`}
              download={`${inv.invoiceNumber}.pdf`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Download className="size-3" /> Download PDF
            </a>
            <span className="text-[13px] font-semibold">
              Total{" "}
              <span className="font-mono">{formatCurrency(inv.total, inv.currency)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const INCLUDED = [
  "Global contracts & EOR in 30+ countries",
  "Payroll, benefits & local tax compliance",
  "One consolidated invoice — no per-hire fees",
  "14-day replacement guarantee on every hire",
];

export default function BillingPage() {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<CompanyInvoice[]>([]);
  const [summary, setSummary] = useState<CompanyInvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getToken();
    const [inv, sum] = await Promise.all([
      fetchCompanyInvoices(token),
      fetchCompanyInvoiceSummaryData(token),
    ]);
    setInvoices(inv);
    setSummary(sum);
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const next = useMemo(
    () =>
      invoices.find((i) => i.status === "overdue") ??
      invoices.find((i) => i.status === "sent") ??
      null,
    [invoices],
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <PageScroll>
      <PageHead
        eyebrow="Billing"
        title="Billing & invoices"
        subtitle="You only pay when you hire. One invoice covers payroll, compliance, and contracts across every engagement."
      />
      <div className="mb-6 flex flex-wrap gap-3.5">
        <SummaryStat
          icon={<Receipt className="size-4" />}
          value={next ? formatCurrency(next.total, next.currency) : "—"}
          label="Next invoice"
          accent
        />
        <SummaryStat
          icon={<CalendarDays className="size-4" />}
          value={next?.dueDate ? formatDate(next.dueDate) : "—"}
          label="Due date"
        />
        <SummaryStat
          icon={<Coins className="size-4" />}
          value={formatCurrency(summary?.totalOutstanding ?? 0)}
          label="Outstanding"
        />
        <SummaryStat
          icon={<CheckCircle2 className="size-4" />}
          value={formatCurrency(summary?.totalPaid ?? 0)}
          label="Lifetime paid"
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[17px] font-semibold">Invoice history</h2>
            <Mono className="text-[10px] text-muted-foreground">
              {invoices.length} invoice{invoices.length === 1 ? "" : "s"}
            </Mono>
          </div>
          {invoices.length === 0 ? (
            <EmptyState
              icon={<Receipt className="size-6" />}
              title="No invoices yet"
              body="Invoices appear here once billing is set up for your active engagements."
            />
          ) : (
            <>
              <div className="grid grid-cols-[20px_1.4fr_1fr_1fr_auto] gap-3 border-b border-border px-1 pb-2">
                {["", "Invoice", "Issued", "Amount", "Status"].map((h, i) => (
                  <Mono
                    key={i}
                    className={cn(
                      "text-[9px] text-muted-foreground",
                      i === 4 && "justify-self-end",
                    )}
                  >
                    {h}
                  </Mono>
                ))}
              </div>
              {invoices.map((inv) => (
                <InvoiceRow key={inv.id} inv={inv} />
              ))}
            </>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <Mono className="text-[10px] text-pulse">What you&apos;re paying for</Mono>
          <div className="mt-3.5 flex flex-col gap-3">
            {INCLUDED.map((t) => (
              <div key={t} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-500">
                  <CheckCircle2 className="size-3" />
                </span>
                <span className="text-[13px] leading-snug">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageScroll>
  );
}
