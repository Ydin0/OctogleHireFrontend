"use client";

import { Building2, Pencil, Star, Trash2 } from "lucide-react";

import type { DeveloperReview } from "@/lib/reviews/types";
import { reviewTagLabels } from "@/lib/reviews/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ownCompanyId,
  onEdit,
  onDelete,
}: {
  reviews: DeveloperReview[];
  ownCompanyId?: string;
  onEdit?: (review: DeveloperReview) => void;
  onDelete?: (reviewId: string) => void;
}) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const isOwn = ownCompanyId && review.companyId === ownCompanyId;

        return (
          <Card key={review.id}>
            <CardContent className="space-y-3 p-4">
              {/* Company info + date row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-7">
                    {review.companyLogoUrl && (
                      <AvatarImage src={review.companyLogoUrl} alt={review.companyName ?? ""} />
                    )}
                    <AvatarFallback className="text-[10px]">
                      {review.companyName ? review.companyName.charAt(0).toUpperCase() : <Building2 className="size-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {review.companyName ?? "Company"}
                    </p>
                    <Stars rating={review.rating} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOwn && onEdit && onDelete && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => onEdit(review)}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-500 hover:text-red-600"
                        onClick={() => onDelete(review.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {review.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {reviewTagLabels[tag]}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Comment */}
              {review.text && (
                <p className="text-sm text-muted-foreground">{review.text}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
