import { auth } from "@clerk/nextjs/server";

import { fetchAdminReviews } from "@/lib/api/reviews";

import { ReviewsClient } from "./_components/reviews-client";

interface ReviewsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminReviewsPage({
  searchParams,
}: ReviewsPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;
  const tab = (params.tab ?? "pending") as
    | "pending"
    | "approved"
    | "rejected"
    | "all";

  const initialReviews = await fetchAdminReviews(
    token,
    tab === "all" ? undefined : tab,
  );

  return (
    <ReviewsClient
      initialReviews={initialReviews}
      initialTab={tab}
      token={token}
    />
  );
}
