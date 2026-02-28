export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

import { getMockPayoutById } from "@/lib/data/mock-payouts";
import { PayoutPDF } from "@/lib/pdf/payout-template";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const payout = getMockPayoutById(id);

  if (!payout) {
    return NextResponse.json(
      { error: "not_found", message: "Payout not found." },
      { status: 404 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(PayoutPDF, { payout }) as any;
  const buffer = await renderToBuffer(element);

  const filename = `${payout.payoutNumber}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
