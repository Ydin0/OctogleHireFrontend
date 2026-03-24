"use client";

import { useState } from "react";
import { MessageSquarePlus, Pencil } from "lucide-react";
import { toast } from "sonner";

import { useReviews } from "@/lib/reviews/use-reviews";
import type { DeveloperReview } from "@/lib/reviews/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewDialog } from "@/app/companies/dashboard/_components/review-dialog";
import { DeveloperReviewsDisplay } from "@/app/companies/dashboard/_components/developer-reviews-display";

export function DeveloperReviewSection({
  developerId,
  developerName,
  companyId,
  companyName,
  companyLogoUrl,
}: {
  developerId: string;
  developerName: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
}) {
  const { reviews, addReview, updateReview, deleteReview, getCompanyReview } = useReviews(developerId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<DeveloperReview | null>(null);

  const existingReview = companyId ? getCompanyReview(companyId) : null;

  const handleEdit = (review: DeveloperReview) => {
    setEditingReview(review);
    setDialogOpen(true);
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
    toast.success("Review deleted");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reviews</CardTitle>
        {existingReview ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => handleEdit(existingReview)}
          >
            <Pencil className="size-3.5" />
            Edit Review
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setEditingReview(null);
              setDialogOpen(true);
            }}
          >
            <MessageSquarePlus className="size-3.5" />
            Leave Review
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to review this developer.
          </p>
        ) : (
          <DeveloperReviewsDisplay
            reviews={reviews}
            ownCompanyId={companyId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </CardContent>
      <ReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        developerName={developerName}
        mode={editingReview ? "edit" : "create"}
        initialValues={editingReview ? { rating: editingReview.rating, tags: editingReview.tags, text: editingReview.text } : undefined}
        onSubmit={(data) => {
          if (editingReview) {
            updateReview(editingReview.id, data);
            toast.success("Review updated");
          } else {
            addReview({ ...data, companyId, companyName, companyLogoUrl });
            toast.success("Review submitted");
          }
          setEditingReview(null);
        }}
      />
    </Card>
  );
}
