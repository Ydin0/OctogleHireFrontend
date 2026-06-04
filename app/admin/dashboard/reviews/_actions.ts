"use server";

import { revalidatePath, updateTag } from "next/cache";

/**
 * Bust the homepage's cached approved-reviews data after an admin
 * approves, rejects, or reopens a review. Without this, `app/page.tsx`
 * (revalidate=300) and the tagged fetch in `fetchApprovedReviews`
 * would serve stale renders for up to 5 minutes after the change.
 *
 * Uses `updateTag` (Next 16+) which is the server-action-only primitive
 * for read-your-own-writes — the next homepage request after this action
 * runs sees the fresh data. `revalidatePath('/')` is a belt-and-braces in
 * case anything on the page slipped through outside the tagged fetch.
 */
export async function revalidateHomepageReviews(): Promise<void> {
  updateTag("approved-reviews");
  revalidatePath("/", "page");
}
