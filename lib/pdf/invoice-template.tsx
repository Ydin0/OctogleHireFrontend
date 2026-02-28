import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import path from "node:path";

import type { Invoice } from "@/lib/api/invoices";

const ZINC_200 = "#e4e4e7";
const ZINC_400 = "#a1a1aa";
const ZINC_600 = "#52525b";
const BLACK = "#09090b";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: BLACK,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 33,
  },
  invoiceLabel: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metaCol: {
    flexDirection: "column",
    gap: 3,
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ZINC_400,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 10,
    color: BLACK,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: ZINC_200,
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ZINC_400,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  addressBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  addressCol: {
    width: "45%",
  },
  addressTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ZINC_400,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 10,
    color: BLACK,
    lineHeight: 1.5,
  },
  periodText: {
    fontSize: 10,
    color: BLACK,
    marginBottom: 16,
  },
  // Table
  table: {
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: ZINC_200,
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: ZINC_200,
  },
  colDeveloper: {
    width: "30%",
  },
  colRole: {
    width: "25%",
  },
  colRate: {
    width: "15%",
    textAlign: "right" as const,
  },
  colHours: {
    width: "10%",
    textAlign: "right" as const,
  },
  colAmount: {
    width: "20%",
    textAlign: "right" as const,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ZINC_400,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  tableCellText: {
    fontSize: 10,
    color: BLACK,
  },
  tableCellMono: {
    fontSize: 10,
    fontFamily: "Courier",
    color: BLACK,
  },
  // Totals
  totalsBlock: {
    marginTop: 8,
    alignItems: "flex-end" as const,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "40%",
    paddingVertical: 3,
  },
  totalsLabel: {
    width: "60%",
    textAlign: "right" as const,
    fontSize: 10,
    color: ZINC_600,
    paddingRight: 12,
  },
  totalsValue: {
    width: "40%",
    textAlign: "right" as const,
    fontSize: 10,
    fontFamily: "Courier",
    color: BLACK,
  },
  totalsBold: {
    fontFamily: "Courier-Bold",
  },
  totalsTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "40%",
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: BLACK,
    marginTop: 2,
  },
  totalsTotalLabel: {
    width: "60%",
    textAlign: "right" as const,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BLACK,
    paddingRight: 12,
  },
  totalsTotalValue: {
    width: "40%",
    textAlign: "right" as const,
    fontSize: 11,
    fontFamily: "Courier-Bold",
    color: BLACK,
  },
  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: ZINC_200,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: ZINC_400,
  },
  paymentTerms: {
    fontSize: 10,
    color: ZINC_600,
    marginTop: 20,
    marginBottom: 8,
  },
  // Bank details
  bankSection: {
    marginTop: 20,
  },
  bankRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  bankLabel: {
    width: 120,
    fontSize: 9,
    color: ZINC_400,
  },
  bankValue: {
    fontSize: 9,
    fontFamily: "Courier",
    color: BLACK,
  },
});

function formatMoney(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatPdfDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const endStr = e.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

interface InvoicePDFProps {
  invoice: Invoice;
}

function InvoicePDF({ invoice }: InvoicePDFProps) {
  const logoPath = path.join(process.cwd(), "public", "octogle-logo.png");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logoPath} style={styles.logo} />
          <Text style={styles.invoiceLabel}>INVOICE</Text>
        </View>

        {/* Meta row */}
        <View style={styles.metaSection}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Invoice Number</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Issue Date</Text>
            <Text style={styles.metaValue}>
              {formatPdfDate(invoice.issuedAt)}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Due Date</Text>
            <Text style={styles.metaValue}>
              {formatPdfDate(invoice.dueDate)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill To / From */}
        <View style={styles.addressBlock}>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>Bill To</Text>
            <Text style={styles.addressText}>{invoice.companyName}</Text>
            <Text style={styles.addressText}>{invoice.companyEmail}</Text>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.addressTitle}>From</Text>
            <Text style={styles.addressText}>Octogle Technologies CO L.L.C</Text>
            <Text style={styles.addressText}>Office 2020 Parklane Tower</Text>
            <Text style={styles.addressText}>Dubai, United Arab Emirates</Text>
            <Text style={styles.addressText}>billing@octogle.com</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Billing Period */}
        <Text style={styles.sectionLabel}>Billing Period</Text>
        <Text style={styles.periodText}>
          {formatPeriod(invoice.periodStart, invoice.periodEnd)}
        </Text>

        {/* Line Items Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={styles.colDeveloper}>
              <Text style={styles.tableHeaderText}>Developer</Text>
            </View>
            <View style={styles.colRole}>
              <Text style={styles.tableHeaderText}>Role</Text>
            </View>
            <View style={styles.colRate}>
              <Text style={styles.tableHeaderText}>Rate</Text>
            </View>
            <View style={styles.colHours}>
              <Text style={styles.tableHeaderText}>Hours</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
          </View>

          {/* Rows */}
          {invoice.lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colDeveloper}>
                <Text style={styles.tableCellText}>{item.developerName}</Text>
              </View>
              <View style={styles.colRole}>
                <Text style={styles.tableCellText}>{item.developerRole}</Text>
              </View>
              <View style={styles.colRate}>
                <Text style={styles.tableCellMono}>
                  {formatMoney(item.hourlyRate, invoice.currency)}
                </Text>
              </View>
              <View style={styles.colHours}>
                <Text style={styles.tableCellMono}>{item.hoursWorked}</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.tableCellMono}>
                  {formatMoney(item.amount, invoice.currency)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {formatMoney(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>
              Tax ({invoice.taxRate}%)
            </Text>
            <Text style={styles.totalsValue}>
              {formatMoney(invoice.taxAmount, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalsTotalRow}>
            <Text style={styles.totalsTotalLabel}>TOTAL</Text>
            <Text style={styles.totalsTotalValue}>
              {formatMoney(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Payment Terms */}
        <Text style={styles.paymentTerms}>Payment Terms: Net 30</Text>

        <View style={styles.divider} />

        {/* Bank Details */}
        <View style={styles.bankSection}>
          <Text style={styles.sectionLabel}>Bank Details</Text>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Beneficiary</Text>
            <Text style={styles.bankValue}>
              Octogle Technologies CO L.L.C
            </Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Bank</Text>
            <Text style={styles.bankValue}>Wio Bank PJSC</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>IBAN</Text>
            <Text style={styles.bankValue}>
              AE07 0860 0000 0120 3456 789
            </Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>SWIFT / BIC</Text>
            <Text style={styles.bankValue}>WIABORAX</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Account Currency</Text>
            <Text style={styles.bankValue}>USD</Text>
          </View>
          <View style={styles.bankRow}>
            <Text style={styles.bankLabel}>Bank Address</Text>
            <Text style={styles.bankValue}>
              Abu Dhabi, United Arab Emirates
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Octogle Technologies CO L.L.C
            </Text>
            <Text style={styles.footerText}>octoglehire.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export { InvoicePDF };
