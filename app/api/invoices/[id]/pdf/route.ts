export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

import { getMockInvoiceById } from "@/lib/data/mock-invoices";
import { InvoicePDF } from "@/lib/pdf/invoice-template";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const invoice = getMockInvoiceById(id);

  if (!invoice) {
    return NextResponse.json(
      { error: "not_found", message: "Invoice not found." },
      { status: 404 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(InvoicePDF, { invoice }) as any;
  const buffer = await renderToBuffer(element);

  const filename = `${invoice.invoiceNumber}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
