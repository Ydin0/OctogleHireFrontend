"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  ExternalLink,
  Linkedin,
  Loader2,
  Quote as QuoteIcon,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type Review,
  type ReviewStatus,
  updateReviewStatus,
} from "@/lib/api/reviews";

type Tab = "pending" | "approved" | "rejected" | "all";

interface ReviewsClientProps {
  initialReviews: Review[];
  initialTab: Tab;
  token: string | null;
}

const TABS: { value: Tab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export const ReviewsClient = ({
  initialReviews,
  initialTab,
  token,
}: ReviewsClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [noteBuffer, setNoteBuffer] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tab = initialTab;

  const changeTab = (next: Tab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", next);
    startTransition(() => {
      router.replace(`?${sp.toString()}`, { scroll: false });
      router.refresh();
    });
  };

  const counts = useMemo(() => {
    const base: Record<Tab, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      all: reviews.length,
    };
    for (const r of reviews) {
      base[r.status as Tab] = (base[r.status as Tab] ?? 0) + 1;
    }
    return base;
  }, [reviews]);

  const setStatus = async (review: Review, status: ReviewStatus) => {
    setPendingIds((s) => new Set(s).add(review.id));
    const result = await updateReviewStatus(
      token,
      review.id,
      status,
      noteBuffer[review.id]?.trim() || undefined,
    );
    setPendingIds((s) => {
      const next = new Set(s);
      next.delete(review.id);
      return next;
    });

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(
      status === "approved"
        ? `Approved — live on homepage`
        : status === "rejected"
          ? "Rejected"
          : "Moved back to pending",
    );

    // Remove from current list if tab-filtered, or update in place for "all"
    setReviews((prev) =>
      tab === "all"
        ? prev.map((r) => (r.id === review.id ? result.review : r))
        : prev.filter((r) => r.id !== review.id),
    );
    setNoteBuffer((n) => {
      const next = { ...n };
      delete next[review.id];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Homepage content
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer reviews
          </h1>
          <p className="text-sm text-muted-foreground">
            Approve submissions from{" "}
            <span className="font-mono text-foreground">/reviews</span> — approved
            stories appear on the homepage savings section.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => changeTab(t.value)}
            className={cn(
              "relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                tab === t.value
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {counts[t.value]}
            </span>
            {tab === t.value && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No {tab === "all" ? "" : tab} reviews
            {tab === "pending" && " — inbox is clear 🎉"}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => {
            const isPending = pendingIds.has(review.id);
            const isExpanded = expandedId === review.id;
            const savingsPct =
              review.localRate > 0
                ? Math.round(
                    ((review.localRate - review.octogleRate) /
                      review.localRate) *
                      100,
                  )
                : 0;

            return (
              <article
                key={review.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Header row */}
                <div className="flex items-start gap-3 border-b border-border p-5">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                    {review.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="size-full object-cover object-[50%_25%]"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                        {review.name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {review.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {review.role}, {review.company}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <a
                        href={review.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Linkedin className="size-2.5" />
                        Profile
                        <ExternalLink className="size-2.5" />
                      </a>
                      <StatusBadge status={review.status} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-mono text-xs font-semibold">
                      −{savingsPct}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {review.hiredCount}× {review.hiredRole}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="p-5 space-y-3">
                  <div className="relative">
                    <QuoteIcon
                      className="absolute -left-0.5 -top-0.5 size-3.5 text-pulse/40"
                      strokeWidth={1.5}
                    />
                    <p
                      className={cn(
                        "pl-5 text-sm leading-relaxed text-foreground/90",
                        !isExpanded && "line-clamp-4",
                      )}
                    >
                      {review.quote}
                    </p>
                  </div>
                  {review.quote.length > 200 && (
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : review.id)
                      }
                      className="text-xs font-medium text-pulse hover:underline"
                    >
                      {isExpanded ? "Collapse" : "Read full quote"}
                    </button>
                  )}

                  {/* Rates row */}
                  <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {review.market}
                      </p>
                      <p className="font-mono text-xs font-semibold line-through decoration-muted-foreground/50">
                        {review.currency}
                        {review.localRate.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Octogle
                      </p>
                      <p className="font-mono text-xs font-semibold text-pulse">
                        {review.currency}
                        {review.octogleRate.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Submitted
                      </p>
                      <p className="font-mono text-xs text-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short" },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Admin note — shown for any status */}
                  <Textarea
                    value={noteBuffer[review.id] ?? review.note ?? ""}
                    onChange={(e) =>
                      setNoteBuffer((n) => ({
                        ...n,
                        [review.id]: e.target.value,
                      }))
                    }
                    placeholder="Optional note (internal — why approved / rejected)"
                    rows={2}
                    className="text-xs"
                  />
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-2 border-t border-border bg-muted/20 p-4">
                  {review.status !== "approved" && (
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5 rounded-full"
                      onClick={() => setStatus(review, "approved")}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Check className="size-3.5" />
                      )}
                      Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 rounded-full"
                      onClick={() => setStatus(review, "rejected")}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <X className="size-3.5" />
                      )}
                      Reject
                    </Button>
                  )}
                  {review.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 rounded-full"
                      onClick={() => setStatus(review, "pending")}
                      disabled={isPending}
                    >
                      <Trash2 className="size-3.5" />
                      Re-queue
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: ReviewStatus }) => {
  const cls =
    status === "approved"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "rejected"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-border bg-muted/40 text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider",
        cls,
      )}
    >
      {status}
    </span>
  );
};
