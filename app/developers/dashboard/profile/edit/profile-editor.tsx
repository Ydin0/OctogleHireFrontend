"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import type { DeveloperProfile } from "@/lib/api/developer";
import { updateDeveloperProfile } from "@/lib/api/developer";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";
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
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  techUsed: string[];
}

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

interface EditableProfile {
  professionalTitle: string;
  aboutLong: string;
  primaryStack: string[];
  workExperience: WorkHistoryItem[];
  education: EducationItem[];
  marketplaceAchievements: string[];
}

const emptyWorkHistoryItem: WorkHistoryItem = {
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  techUsed: [],
};

const emptyEducationItem: EducationItem = {
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
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
    title: item?.title ?? item?.role ?? "",
    startDate: item?.startDate ?? "",
    endDate: item?.endDate ?? "",
    current: item?.current ?? false,
    description: item?.description ?? "",
    techUsed: Array.isArray(item?.techUsed) ? item.techUsed : [],
  }));
}

function parseEducation(raw: unknown): EducationItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    institution: item?.institution ?? "",
    degree: item?.degree ?? "",
    field: item?.field ?? item?.grade ?? "",
    startYear: item?.startYear ?? "",
    endYear: item?.endYear ?? "",
  }));
}

function parseAchievements(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

function formatDuration(item: WorkHistoryItem): string {
  if (!item.startDate) return "";
  const end = item.current ? "Present" : item.endDate || "";
  return end ? `${item.startDate} - ${end}` : item.startDate;
}

const ProfileEditor = ({ profile }: { profile: DeveloperProfile | null }) => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<EditableProfile>({
    professionalTitle: profile?.professionalTitle ?? "",
    aboutLong: profile?.aboutLong || profile?.bio || "",
    primaryStack: [...(profile?.primaryStack ?? [])],
    workExperience: parseWorkExperience(profile?.workExperience),
    education: parseEducation(profile?.education),
    marketplaceAchievements: parseAchievements(profile?.marketplaceAchievements),
  });

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
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const next = [...prev.workExperience];
      const row = { ...next[index] };

      if (key === "techUsed" && typeof value === "string") {
        row.techUsed = value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean);
      } else if (key === "current" && typeof value === "boolean") {
        row.current = value;
      } else {
        (row[key] as string) = value as string;
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

  const updateEducation = (
    index: number,
    key: keyof EducationItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, education: next };
    });
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
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
        education: formData.education,
        marketplaceAchievements: formData.marketplaceAchievements,
      });
      toast.success("Profile saved successfully");
      setFeedback({ type: "success", message: "Profile saved successfully." });
      router.refresh();
    } catch {
      toast.error("Failed to save profile");
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
        {/* Live Preview */}
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
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{formData.aboutLong}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Tech Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.primaryStack.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                {formData.primaryStack.length === 0 && (
                  <p className="text-xs text-muted-foreground">No skills selected.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Work History</h3>
              <div className="mt-3 space-y-3">
                {formData.workExperience.length === 0 && (
                  <p className="text-xs text-muted-foreground">No work history added.</p>
                )}
                {formData.workExperience.map((item, index) => (
                  <div key={`wh-preview-${index}`} className="rounded-lg border border-border/70 p-3">
                    <p className="text-sm font-semibold">{item.title || "Role"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.company || "Company"}
                      {formatDuration(item) ? ` \u00b7 ${formatDuration(item)}` : ""}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.techUsed.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.techUsed.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-[10px]">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="mt-3 space-y-3">
                {formData.education.length === 0 && (
                  <p className="text-xs text-muted-foreground">No education added.</p>
                )}
                {formData.education.map((item, index) => (
                  <div key={`edu-preview-${index}`} className="rounded-lg border border-border/70 p-3">
                    <p className="text-sm font-semibold">
                      {item.degree || "Degree"}{item.field ? ` in ${item.field}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.institution || "Institution"}
                      {item.startYear || item.endYear
                        ? ` \u00b7 ${item.startYear}${item.endYear ? ` - ${item.endYear}` : ""}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {formData.marketplaceAchievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Top Achievements</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {formData.marketplaceAchievements.map((achievement, index) => (
                    <li key={`ach-preview-${index}`}>{achievement || "Untitled achievement"}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editable Fields */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Editable Fields</CardTitle>
            <CardDescription>
              Adjust profile sections and save your approved profile updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Professional Title */}
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

            {/* About */}
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

            {/* Skills — TechStackSelector */}
            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                Skills
              </p>
              <TechStackSelector
                value={formData.primaryStack}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, primaryStack: value }))
                }
                max={8}
              />
            </div>

            {/* Work History */}
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
                  <div key={`wh-edit-${index}`} className="rounded-lg border border-border/70 p-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Company"
                        value={item.company}
                        onChange={(event) =>
                          updateWorkHistory(index, "company", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Role / Title"
                        value={item.title}
                        onChange={(event) =>
                          updateWorkHistory(index, "title", event.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Start date (e.g. Jan 2022)"
                          value={item.startDate}
                          onChange={(event) =>
                            updateWorkHistory(index, "startDate", event.target.value)
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="End date"
                            value={item.current ? "" : item.endDate}
                            disabled={item.current}
                            onChange={(event) =>
                              updateWorkHistory(index, "endDate", event.target.value)
                            }
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={item.current}
                          onChange={(event) =>
                            updateWorkHistory(index, "current", event.target.checked)
                          }
                          className="rounded border-input"
                        />
                        Currently working here
                      </label>
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

            {/* Education */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                  Education
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      education: [...prev.education, { ...emptyEducationItem }],
                    }))
                  }
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {formData.education.map((item, index) => (
                  <div key={`edu-edit-${index}`} className="rounded-lg border border-border/70 p-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Institution"
                        value={item.institution}
                        onChange={(event) =>
                          updateEducation(index, "institution", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Degree (e.g. BSc, MSc, PhD)"
                        value={item.degree}
                        onChange={(event) =>
                          updateEducation(index, "degree", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Field of study"
                        value={item.field}
                        onChange={(event) =>
                          updateEducation(index, "field", event.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Start year"
                          value={item.startYear}
                          onChange={(event) =>
                            updateEducation(index, "startYear", event.target.value)
                          }
                        />
                        <Input
                          placeholder="End year"
                          value={item.endYear}
                          onChange={(event) =>
                            updateEducation(index, "endYear", event.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-fit"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="size-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
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
                  <div key={`ach-edit-${index}`} className="flex items-center gap-2">
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
