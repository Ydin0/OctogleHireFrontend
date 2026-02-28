import { PayoutDetailClient } from "./_components/payout-detail-client";

export default function PayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PayoutDetailClient params={params} />;
}
