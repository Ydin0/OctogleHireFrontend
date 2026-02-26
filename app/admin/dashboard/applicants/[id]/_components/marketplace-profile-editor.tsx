"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const centsToDollars = (cents: number | null): string => {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
};

const dollarsToCents = (dollars: string): number | null => {
  if (!dollars) return null;
  const parsed = parseFloat(dollars);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100);
};

interface MarketplaceProfileEditorProps {
  applicationId: string;
  token: string;
  initialData: {
    hourlyRateCents: number | null;
    monthlyRateCents: number | null;
    marketplaceRating: string | null;
    marketplaceProjects: number | null;
    marketplaceAchievements: string[] | null;
    marketplaceAwards: { title: string; issuer: string; year: string }[] | null;
    aboutLong: string | null;
  };
}

const MarketplaceProfileEditor = ({
  applicationId,
  token,
  initialData,
}: MarketplaceProfileEditorProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hourlyRate, setHourlyRate] = useState(
    centsToDollars(initialData.hourlyRateCents)
  );
  const [monthlyRate, setMonthlyRate] = useState(
    centsToDollars(initialData.monthlyRateCents)
  );
  const [rating, setRating] = useState(initialData.marketplaceRating ?? "");
  const [projects, setProjects] = useState(
    initialData.marketplaceProjects?.toString() ?? ""
  );
  const [aboutLong, setAboutLong] = useState(initialData.aboutLong ?? "");

  const [achievements, setAchievements] = useState<string[]>(
    initialData.marketplaceAchievements ?? []
  );
  const [newAchievement, setNewAchievement] = useState("");

  const [awards, setAwards] = useState<
    { title: string; issuer: string; year: string }[]
  >(initialData.marketplaceAwards ?? []);

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements((prev) => [...prev, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const addAward = () => {
    setAwards((prev) => [...prev, { title: "", issuer: "", year: "" }]);
  };

  const updateAward = (
    index: number,
    field: "title" | "issuer" | "year",
    value: string
  ) => {
    setAwards((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const removeAward = (index: number) => {
    setAwards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/marketplace-profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hourlyRateCents: dollarsToCents(hourlyRate),
            monthlyRateCents: dollarsToCents(monthlyRate),
            marketplaceRating: rating || null,
            marketplaceProjects: projects ? Number(projects) : null,
            marketplaceAchievements: achievements,
            marketplaceAwards: awards.filter((a) => a.title),
            aboutLong: aboutLong || null,
          }),
        }
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to save profile");
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Marketplace Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <Label className="text-xs">Hourly Rate (USD)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="125.00"
                className="pl-7 font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Monthly Rate (USD)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                placeholder="15,000.00"
                className="pl-7 font-mono"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Rating</Label>
            <Input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g. 4.9"
            />
          </div>
          <div>
            <Label className="text-xs">Projects Count</Label>
            <Input
              type="number"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder="e.g. 47"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">About (Long Bio)</Label>
          <Textarea
            value={aboutLong}
            onChange={(e) => setAboutLong(e.target.value)}
            placeholder="Extended bio for the marketplace profile page..."
            rows={4}
          />
        </div>

        <div>
          <Label className="text-xs">Achievements</Label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {achievements.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
              >
                {a}
                <button
                  type="button"
                  onClick={() => removeAchievement(i)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              placeholder="Add achievement..."
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAchievement();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs">Awards</Label>
          <div className="mt-1 space-y-2">
            {awards.map((award, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={award.title}
                  onChange={(e) => updateAward(i, "title", e.target.value)}
                  placeholder="Title"
                  className="text-sm"
                />
                <Input
                  value={award.issuer}
                  onChange={(e) => updateAward(i, "issuer", e.target.value)}
                  placeholder="Issuer"
                  className="text-sm"
                />
                <Input
                  value={award.year}
                  onChange={(e) => updateAward(i, "year", e.target.value)}
                  placeholder="Year"
                  className="w-24 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAward(i)}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addAward}
          >
            <Plus className="size-3 mr-1" />
            Add Award
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          <Save className="size-4 mr-1.5" />
          {saved ? "Saved" : isLoading ? "Saving..." : "Save Marketplace Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export { MarketplaceProfileEditor };
