"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

import type { WorkHistoryItem } from "@/lib/data/developers";
import {
  currentDeveloper,
  getInitials,
} from "../../_components/dashboard-data";
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

interface EditableProfile {
  role: string;
  about: string;
  skills: string[];
  workHistory: WorkHistoryItem[];
  achievements: string[];
}

const emptyWorkHistoryItem: WorkHistoryItem = {
  company: "",
  role: "",
  duration: "",
  description: "",
  techUsed: [],
};

const ProfileEditor = () => {
  const [profile, setProfile] = useState<EditableProfile>({
    role: currentDeveloper.role,
    about: currentDeveloper.about,
    skills: [...currentDeveloper.skills],
    workHistory: currentDeveloper.workHistory.map((item) => ({ ...item })),
    achievements: [...currentDeveloper.achievements],
  });

  const [skillInput, setSkillInput] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const firstName = useMemo(
    () => currentDeveloper.name.split(" ")[0],
    [],
  );

  const updateWorkHistory = (
    index: number,
    key: keyof WorkHistoryItem,
    value: string,
  ) => {
    setProfile((prev) => {
      const next = [...prev.workHistory];
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

      return { ...prev, workHistory: next };
    });
  };

  const removeWorkHistory = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index),
    }));
  };

  const updateAchievement = (index: number, value: string) => {
    setProfile((prev) => {
      const next = [...prev.achievements];
      next[index] = value;
      return { ...prev, achievements: next };
    });
  };

  const removeAchievement = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (profile.skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }

    setProfile((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill),
    }));
  };

  const handleSave = () => {
    setSavedAt(new Date().toLocaleString("en-US"));
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
                <AvatarImage src={currentDeveloper.avatar} alt={currentDeveloper.name} />
                <AvatarFallback>{getInitials(currentDeveloper.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{currentDeveloper.name}</p>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">About {firstName}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{profile.about}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Tech Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Work History</h3>
              <div className="mt-3 space-y-3">
                {profile.workHistory.map((item, index) => (
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
                {profile.achievements.map((achievement, index) => (
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
                value={profile.role}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, role: event.target.value }))
                }
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-muted-foreground">
                About summary
              </p>
              <Textarea
                rows={6}
                value={profile.about}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, about: event.target.value }))
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
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
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
                    setProfile((prev) => ({
                      ...prev,
                      workHistory: [...prev.workHistory, { ...emptyWorkHistoryItem }],
                    }))
                  }
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {profile.workHistory.map((item, index) => (
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
                    setProfile((prev) => ({
                      ...prev,
                      achievements: [...prev.achievements, ""],
                    }))
                  }
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {profile.achievements.map((achievement, index) => (
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
            >
              <Save className="size-4" />
              Save profile updates
            </Button>

            {savedAt && (
              <p className="text-xs text-muted-foreground">Saved locally at {savedAt}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { ProfileEditor };
