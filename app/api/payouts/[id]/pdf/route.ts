export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { auth } from "@clerk/nextjs/server";

import type { Payout } from "@/lib/api/payouts";
import { PayoutPDF } from "@/lib/pdf/payout-template";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return NextResponse.json(
      { error: "unauthorized", message: "Not authenticated." },
      { status: 401 },
    );
  }

  // Try admin endpoint first, then developer endpoint
  let payout: Payout | null = null;

  const adminResponse = await fetch(`${apiBaseUrl}/api/admin/payouts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (adminResponse.ok) {
    payout = (await adminResponse.json()) as Payout;
  } else {
    const devResponse = await fetch(
      `${apiBaseUrl}/api/developers/earnings/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (devResponse.ok) {
      payout = (await devResponse.json()) as Payout;
    }
  }

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
