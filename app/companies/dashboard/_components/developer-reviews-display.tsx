"use client";

import { Star } from "lucide-react";

import type { DeveloperReview } from "@/lib/reviews/types";
import { reviewTagLabels } from "@/lib/reviews/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

export function DeveloperReviewsDisplay({
  reviews,
}: {
  reviews: DeveloperReview[];
}) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <Stars rating={review.rating} />
              <p className="font-mono text-[10px] text-muted-foreground">
                {formatDate(review.createdAt)}
              </p>
            </div>
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {reviewTagLabels[tag]}
                  </Badge>
                ))}
              </div>
            )}
            {review.text && (
              <p className="text-sm text-muted-foreground">{review.text}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
