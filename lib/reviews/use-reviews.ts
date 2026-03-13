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
    (data: {
      rating: number;
      tags: ReviewTag[];
      text: string;
      engagementId?: string;
      companyId?: string;
      companyName?: string;
      companyLogoUrl?: string | null;
    }) => {
      const review: DeveloperReview = {
        id: crypto.randomUUID(),
        developerId,
        engagementId: data.engagementId,
        companyId: data.companyId,
        companyName: data.companyName,
        companyLogoUrl: data.companyLogoUrl,
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

  const updateReview = useCallback(
    (reviewId: string, data: { rating: number; tags: ReviewTag[]; text: string }) => {
      const all = loadReviews().map((r) =>
        r.id === reviewId ? { ...r, ...data } : r,
      );
      persistReviews(all);
      setReviews(all.filter((r) => r.developerId === developerId));
    },
    [developerId],
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      const all = loadReviews().filter((r) => r.id !== reviewId);
      persistReviews(all);
      setReviews(all.filter((r) => r.developerId === developerId));
    },
    [developerId],
  );

  const hasReviewed = useCallback(
    (engagementId: string) => reviews.some((r) => r.engagementId === engagementId),
    [reviews],
  );

  const hasCompanyReviewed = useCallback(
    (companyId: string) => reviews.some((r) => r.companyId === companyId),
    [reviews],
  );

  const getCompanyReview = useCallback(
    (companyId: string) => reviews.find((r) => r.companyId === companyId) ?? null,
    [reviews],
  );

  return { reviews, addReview, updateReview, deleteReview, hasReviewed, hasCompanyReviewed, getCompanyReview };
}
