import { InvoiceDetailClient } from "./_components/invoice-detail-client";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <InvoiceDetailClient params={params} />;
}
