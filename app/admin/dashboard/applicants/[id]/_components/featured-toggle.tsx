"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface FeaturedToggleProps {
  applicationId: string;
  isLive: boolean;
  initialFeatured: boolean;
  token: string;
}

const FeaturedToggle = ({
  applicationId,
  isLive,
  initialFeatured,
  token,
}: FeaturedToggleProps) => {
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(initialFeatured);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/featured`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFeatured: !isFeatured }),
        }
      );

      if (response.ok) {
        setIsFeatured(!isFeatured);
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={!isLive || isLoading}
      className={
        isFeatured
          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
          : ""
      }
    >
      <Star
        className={`size-4 mr-1.5 ${isFeatured ? "fill-amber-500 text-amber-500" : ""}`}
      />
      {isLoading ? "Updating..." : isFeatured ? "Featured" : "Feature"}
    </Button>
  );
};

export { FeaturedToggle };
