"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";

import { updateAgencyCandidate } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  userId: string;
  name: string;
}

interface CandidateEditFormProps {
  candidateId: string;
  initialData: {
    email: string | null;
    fullName: string | null;
    phone: string | null;
    professionalTitle: string | null;
    bio: string | null;
    locationCity: string | null;
    locationState: string | null;
    yearsOfExperience: number | null;
    availability: string | null;
    englishProficiency: string | null;
    salaryCurrency: string | null;
    hourlyRateCents: number | null;
    monthlyRateCents: number | null;
    primaryStack: string[] | null;
    sourcedByUserId: string | null;
    sourcedByName: string | null;
  };
  teamMembers?: TeamMember[];
}

function CandidateEditForm({ candidateId, initialData, teamMembers = [] }: CandidateEditFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlaceholder = initialData.email?.includes("@linkedin-import.placeholder") ||
    initialData.email?.includes("@import.placeholder");

  const missingFields: string[] = [];
  if (!initialData.email || isPlaceholder) missingFields.push("Email");
  if (!initialData.phone) missingFields.push("Phone");
  if (!initialData.hourlyRateCents) missingFields.push("Hourly Rate");
  if (!initialData.monthlyRateCents) missingFields.push("Monthly Rate");
  if (!initialData.availability) missingFields.push("Availability");

  const [form, setForm] = useState({
    email: isPlaceholder ? "" : (initialData.email ?? ""),
    fullName: initialData.fullName ?? "",
    phone: initialData.phone ?? "",
    professionalTitle: initialData.professionalTitle ?? "",
    bio: initialData.bio ?? "",
    locationCity: initialData.locationCity ?? "",
    locationState: initialData.locationState ?? "",
    yearsOfExperience: initialData.yearsOfExperience ?? 0,
    availability: initialData.availability ?? "",
    englishProficiency: initialData.englishProficiency ?? "",
    salaryCurrency: initialData.salaryCurrency ?? "USD",
    hourlyRate: initialData.hourlyRateCents ? initialData.hourlyRateCents / 100 : 0,
    monthlyRate: initialData.monthlyRateCents ? initialData.monthlyRateCents / 100 : 0,
    primaryStack: initialData.primaryStack ?? [],
    sourcedByUserId: initialData.sourcedByUserId ?? "",
    sourcedByName: initialData.sourcedByName ?? "",
  });
  const [newSkill, setNewSkill] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      await updateAgencyCandidate(token, candidateId, {
        email: form.email || undefined,
        fullName: form.fullName || undefined,
        phone: form.phone || undefined,
        professionalTitle: form.professionalTitle || undefined,
        bio: form.bio || undefined,
        locationCity: form.locationCity || undefined,
        locationState: form.locationState || undefined,
        yearsOfExperience: form.yearsOfExperience || undefined,
        availability: form.availability || undefined,
        englishProficiency: form.englishProficiency || undefined,
        salaryCurrency: form.salaryCurrency || undefined,
        hourlyRate: form.hourlyRate || undefined,
        monthlyRate: form.monthlyRate || undefined,
        primaryStack: form.primaryStack,
        sourcedByUserId: form.sourcedByUserId || undefined,
        sourcedByName: form.sourcedByName || undefined,
      });
      setEditing(false);
      toast.success("Candidate updated successfully");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save";
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Profile Details</CardTitle>
          <div className="flex items-center gap-2">
            {missingFields.length > 0 && (
              <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700 text-[10px] dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {missingFields.length} missing
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
              <Pencil className="size-3" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
              <p className={isPlaceholder || !initialData.email ? "text-amber-600" : ""}>
                {isPlaceholder ? "Not provided" : (initialData.email ?? "Not provided")}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</p>
              <p className={!initialData.phone ? "text-muted-foreground" : ""}>
                {initialData.phone ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Availability</p>
              <p className={!initialData.availability ? "text-muted-foreground" : ""}>
                {initialData.availability ?? "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">English</p>
              <p className={!initialData.englishProficiency ? "text-muted-foreground" : ""}>
                {initialData.englishProficiency ?? "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hourly Rate</p>
              <p className={`font-mono ${!initialData.hourlyRateCents ? "text-muted-foreground" : ""}`}>
                {initialData.hourlyRateCents
                  ? `${initialData.salaryCurrency ?? "USD"} ${(initialData.hourlyRateCents / 100).toFixed(0)}/hr`
                  : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Rate</p>
              <p className={`font-mono ${!initialData.monthlyRateCents ? "text-muted-foreground" : ""}`}>
                {initialData.monthlyRateCents
                  ? `${initialData.salaryCurrency ?? "USD"} ${(initialData.monthlyRateCents / 100).toFixed(0)}/mo`
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Tech Stack (read-only) */}
          {initialData.primaryStack && initialData.primaryStack.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Tech Stack</p>
              <div className="flex flex-wrap gap-1">
                {initialData.primaryStack.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sourced By (read-only) */}
          {initialData.sourcedByName && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sourced By</p>
              <p className="text-sm font-medium">{initialData.sourcedByName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Edit Profile</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
            <X className="size-3.5" />
            Cancel
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={saving}>
            <Save className="size-3" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Full Name</Label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Email {isPlaceholder && <span className="text-amber-600">*required</span>}
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="candidate@email.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input value={form.professionalTitle} onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">City</Label>
            <Input value={form.locationCity} onChange={(e) => setForm({ ...form, locationCity: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">State / Country</Label>
            <Input value={form.locationState} onChange={(e) => setForm({ ...form, locationState: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Years of Experience</Label>
            <Input type="number" min={0} value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Availability</Label>
            <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v })}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="2_weeks">2 Weeks</SelectItem>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">English Proficiency</Label>
            <Select value={form.englishProficiency} onValueChange={(v) => setForm({ ...form, englishProficiency: v })}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="native">Native</SelectItem>
                <SelectItem value="fluent">Fluent</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Currency</Label>
            <Select value={form.salaryCurrency} onValueChange={(v) => setForm({ ...form, salaryCurrency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Hourly Rate</Label>
            <Input type="number" min={0} value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly Rate</Label>
            <Input type="number" min={0} value={form.monthlyRate} onChange={(e) => setForm({ ...form, monthlyRate: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Bio / Summary</Label>
          <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
        </div>

        {/* Tech Stack */}
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Tech Stack</Label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.primaryStack.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 text-xs">
                {skill}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, primaryStack: form.primaryStack.filter((s) => s !== skill) })}
                  className="ml-0.5 hover:text-destructive"
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const skill = newSkill.trim();
                  if (skill && !form.primaryStack.includes(skill)) {
                    setForm({ ...form, primaryStack: [...form.primaryStack, skill] });
                    setNewSkill("");
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const skill = newSkill.trim();
                if (skill && !form.primaryStack.includes(skill)) {
                  setForm({ ...form, primaryStack: [...form.primaryStack, skill] });
                  setNewSkill("");
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Sourced By */}
        {teamMembers.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Sourced By</Label>
            <Select
              value={form.sourcedByUserId || "unassigned"}
              onValueChange={(v) => {
                if (v === "unassigned") {
                  setForm({ ...form, sourcedByUserId: "", sourcedByName: "" });
                } else {
                  const member = teamMembers.find((m) => m.userId === v);
                  setForm({ ...form, sourcedByUserId: v, sourcedByName: member?.name ?? "" });
                }
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select team member..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { CandidateEditForm };
