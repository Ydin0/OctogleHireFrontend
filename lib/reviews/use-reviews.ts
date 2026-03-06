"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeveloperReview, ReviewTag } from "./types";

const STORAGE_KEY = "octoglehire:reviews";

function loadReviews(): DeveloperReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeveloperReview[]) : [];
  } catch {
    return [];
  }
}

function persistReviews(reviews: DeveloperReview[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function useReviews(developerId: string) {
  const [reviews, setReviews] = useState<DeveloperReview[]>([]);

  useEffect(() => {
    setReviews(loadReviews().filter((r) => r.developerId === developerId));
  }, [developerId]);

  const addReview = useCallback(
    (data: { rating: number; tags: ReviewTag[]; text: string; engagementId?: string }) => {
      const review: DeveloperReview = {
        id: crypto.randomUUID(),
        developerId,
        engagementId: data.engagementId,
        rating: data.rating,
        tags: data.tags,
        text: data.text,
        createdAt: new Date().toISOString(),
      };

      const all = loadReviews();
      all.unshift(review);
      persistReviews(all);
      setReviews(all.filter((r) => r.developerId === developerId));

      return review;
    },
    [developerId],
  );

  const hasReviewed = useCallback(
    (engagementId: string) => reviews.some((r) => r.engagementId === engagementId),
    [reviews],
  );

  return { reviews, addReview, hasReviewed };
}
