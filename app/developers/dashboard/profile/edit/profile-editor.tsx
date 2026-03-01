"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import type { DeveloperProfile } from "@/lib/api/developer";
import { updateDeveloperProfile } from "@/lib/api/developer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WorkHistoryItem {
  company: string;
  role: string;
  duration: string;
  description: string;
  techUsed: string[];
}

interface EditableProfile {
  professionalTitle: string;
  aboutLong: string;
  primaryStack: string[];
  workExperience: WorkHistoryItem[];
  marketplaceAchievements: string[];
}

const emptyWorkHistoryItem: WorkHistoryItem = {
  company: "",
  role: "",
  duration: "",
  description: "",
  techUsed: [],
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseWorkExperience(raw: unknown): WorkHistoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    company: item?.company ?? "",
    role: item?.role ?? "",
    duration: item?.duration ?? "",
    description: item?.description ?? "",
    techUsed: Array.isArray(item?.techUsed) ? item.techUsed : [],
  }));
}

function parseAchievements(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

const ProfileEditor = ({ profile }: { profile: DeveloperProfile | null }) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<EditableProfile>({
    professionalTitle: profile?.professionalTitle ?? "",
    aboutLong: profile?.aboutLong || profile?.bio || "",
    primaryStack: [...(profile?.primaryStack ?? [])],
    workExperience: parseWorkExperience(profile?.workExperience),
    marketplaceAchievements: parseAchievements(profile?.marketplaceAchievements),
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const displayName = profile?.fullName ?? "Developer";
  const firstName = useMemo(
    () => displayName.split(" ")[0],
    [displayName],
  );

  const updateWorkHistory = (
    index: number,
    key: keyof WorkHistoryItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const next = [...prev.workExperience];
      const row = { ...next[index] };

      if (key === "techUsed") {
        row.techUsed = value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean);
      } else {
        (row[key] as string) = value;
      }

      next[index] = row;

      return { ...prev, workExperience: next };
    });
  };

  const removeWorkHistory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const updateAchievement = (index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.marketplaceAchievements];
      next[index] = value;
      return { ...prev, marketplaceAchievements: next };
    });
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      marketplaceAchievements: prev.marketplaceAchievements.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (formData.primaryStack.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({ ...prev, primaryStack: [...prev.primaryStack, value] }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryStack: prev.primaryStack.filter((item) => item !== skill),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const token = await getToken();
      await updateDeveloperProfile(token, {
        professionalTitle: formData.professionalTitle,
        aboutLong: formData.aboutLong,
        primaryStack: formData.primaryStack,
        workExperience: formData.workExperience,
      });
      setFeedback({ type: "success", message: "Profile saved successfully." });
      router.refresh();
    } catch {
      setFeedback({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Edit Public Profile</CardTitle>
          <CardDescription>
            Update approved profile sections that companies see publicly.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              Public-facing view as clients will see your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border border-pulse/30">
                <AvatarImage src={profile?.profilePhotoUrl ?? undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">{formData.professionalTitle}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">About {firstName}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{formData.aboutLong}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Tech Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.primaryStack.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Work History</h3>
              <div className="mt-3 space-y-3">
                {formData.workExperience.map((item, index) => (
                  <div key={`${item.company}-${index}`} className="rounded-lg border border-border/70 p-3">
                    <p className="text-sm font-semibold">{item.role || "Role"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.company || "Company"} {item.duration ? `- ${item.duration}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description || "No description yet."}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Top Achievements</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {formData.marketplaceAchievements.map((achievement, index) => (
                  <li key={`${achievement}-${index}`}>{achievement || "Untitled achievement"}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Editable Fields</CardTitle>
            <CardDescription>
              Adjust profile sections and save your approved profile updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Professional title
              </p>
              <Input
                value={formData.professionalTitle}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, professionalTitle: event.target.value }))
                }
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                About summary
              </p>
              <Textarea
                rows={6}
                value={formData.aboutLong}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, aboutLong: event.target.value }))
                }
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Skills
              </p>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  placeholder="Add a skill"
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.primaryStack.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full border border-border px-2 py-0.5 text-xs hover:bg-muted"
                  >
                    {skill} x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Work history
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      workExperience: [...prev.workExperience, { ...emptyWorkHistoryItem }],
                    }))
                  }
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {formData.workExperience.map((item, index) => (
                  <div key={`${item.company}-${index}`} className="rounded-lg border border-border/70 p-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Company"
                        value={item.company}
                        onChange={(event) =>
                          updateWorkHistory(index, "company", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Role"
                        value={item.role}
                        onChange={(event) =>
                          updateWorkHistory(index, "role", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Duration"
                        value={item.duration}
                        onChange={(event) =>
                          updateWorkHistory(index, "duration", event.target.value)
                        }
                      />
                      <Textarea
                        rows={3}
                        placeholder="Description"
                        value={item.description}
                        onChange={(event) =>
                          updateWorkHistory(index, "description", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Tech used (comma separated)"
                        value={item.techUsed.join(", ")}
                        onChange={(event) =>
                          updateWorkHistory(index, "techUsed", event.target.value)
                        }
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={() => removeWorkHistory(index)}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Achievements
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      marketplaceAchievements: [...prev.marketplaceAchievements, ""],
                    }))
                  }
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {formData.marketplaceAchievements.map((achievement, index) => (
                  <div key={`${achievement}-${index}`} className="flex items-center gap-2">
                    <Input
                      value={achievement}
                      onChange={(event) =>
                        updateAchievement(index, event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      onClick={() => removeAchievement(index)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-pulse text-pulse-foreground hover:bg-pulse/90"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saving ? "Saving..." : "Save profile updates"}
            </Button>

            {feedback && (
              <p className={`text-xs ${feedback.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                {feedback.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { ProfileEditor };
