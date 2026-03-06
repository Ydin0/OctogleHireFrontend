"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import { useReviews } from "@/lib/reviews/use-reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewDialog } from "@/app/companies/dashboard/_components/review-dialog";
import { DeveloperReviewsDisplay } from "@/app/companies/dashboard/_components/developer-reviews-display";

export function DeveloperReviewSection({
  developerId,
  developerName,
}: {
  developerId: string;
  developerName: string;
}) {
  const { reviews, addReview } = useReviews(developerId);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reviews</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setDialogOpen(true)}
        >
          <MessageSquarePlus className="size-3.5" />
          Leave Review
        </Button>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to review this developer.
          </p>
        ) : (
          <DeveloperReviewsDisplay reviews={reviews} />
        )}
      </CardContent>
      <ReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        developerName={developerName}
        onSubmit={(data) => addReview(data)}
      />
    </Card>
  );
}
