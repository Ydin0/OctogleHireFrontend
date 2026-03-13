"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { type ReviewTag, reviewTagLabels } from "@/lib/reviews/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ALL_TAGS: ReviewTag[] = [
  "communication",
  "technical_skill",
  "reliability",
  "problem_solving",
  "collaboration",
  "delivery_speed",
];

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developerName: string;
  onSubmit: (data: { rating: number; tags: ReviewTag[]; text: string }) => void;
  initialValues?: { rating: number; tags: ReviewTag[]; text: string };
  mode?: "create" | "edit";
}

export function ReviewDialog({
  open,
  onOpenChange,
  developerName,
  onSubmit,
  initialValues,
  mode = "create",
}: ReviewDialogProps) {
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>(initialValues?.tags ?? []);
  const [text, setText] = useState(initialValues?.text ?? "");

  useEffect(() => {
    if (open && initialValues) {
      setRating(initialValues.rating);
      setSelectedTags(initialValues.tags);
      setText(initialValues.text);
    }
  }, [open, initialValues]);

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setSelectedTags([]);
    setText("");
  };

  const toggleTag = (tag: ReviewTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, tags: selectedTags, text });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Review" : `Review ${developerName}`}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update your review for this developer."
              : "Share your experience working with this developer."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Star Rating */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Rating
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-6 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Strengths
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer select-none"
                  onClick={() => toggleTag(tag)}
                >
                  {reviewTagLabels[tag]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Comments (optional)
            </p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What was it like working with this developer?"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            {mode === "edit" ? "Save Changes" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
