export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// This route proxies to the backend's authoritative PDF renderer so the
// preview iframe (which can't send Bearer headers itself) and the email
// attachment use exactly the same PDF source.
export async function GET(
  request: Request,
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

  const url = new URL(request.url);
  const isDownload = url.searchParams.get("download") === "1";

  const upstream = await fetch(`${apiBaseUrl}/api/admin/invoices/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "not_found", message: "Invoice not found." },
      { status: upstream.status },
    );
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  const filename = upstream.headers
    .get("content-disposition")
    ?.match(/filename="([^"]+)"/)?.[1] ?? `invoice-${id}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
