"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { addAgencyCandidate } from "@/lib/api/agencies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddDeveloperDialog = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    professionalTitle: "",
    primaryStack: "",
    yearsOfExperience: "",
    locationCity: "",
    locationState: "",
    availability: "immediately",
    hourlyRate: "",
    monthlyRate: "",
    salaryCurrency: "USD",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.email.trim()) return;

    setSubmitting(true);
    const token = await getToken();

    const payload = {
      fullName: form.fullName.trim() || undefined,
      email: form.email.trim(),
      professionalTitle: form.professionalTitle.trim() || undefined,
      primaryStack: form.primaryStack.trim()
        ? form.primaryStack.split(",").map((s) => s.trim())
        : undefined,
      yearsOfExperience: form.yearsOfExperience
        ? Number(form.yearsOfExperience)
        : undefined,
      locationCity: form.locationCity.trim() || undefined,
      locationState: form.locationState.trim() || undefined,
      availability: form.availability || undefined,
      hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
      salaryCurrency: form.salaryCurrency,
    };

    const result = await addAgencyCandidate(token, payload);
    setSubmitting(false);

    if (result) {
      setOpen(false);
      setForm({
        fullName: "",
        email: "",
        professionalTitle: "",
        primaryStack: "",
        yearsOfExperience: "",
        locationCity: "",
        locationState: "",
        availability: "immediately",
        hourlyRate: "",
        monthlyRate: "",
        salaryCurrency: "USD",
      });
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Developer</DialogTitle>
          <DialogDescription>
            Manually add a developer to your candidate pool.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dev-name" className="text-xs">
                Full Name
              </Label>
              <Input
                id="dev-name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-email" className="text-xs">
                Email *
              </Label>
              <Input
                id="dev-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dev-title" className="text-xs">
              Professional Title
            </Label>
            <Input
              id="dev-title"
              value={form.professionalTitle}
              onChange={(e) => updateField("professionalTitle", e.target.value)}
              placeholder="Senior React Developer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dev-stack" className="text-xs">
              Tech Stack (comma-separated)
            </Label>
            <Input
              id="dev-stack"
              value={form.primaryStack}
              onChange={(e) => updateField("primaryStack", e.target.value)}
              placeholder="React, Node.js, TypeScript"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dev-exp" className="text-xs">
                Years of Exp
              </Label>
              <Input
                id="dev-exp"
                type="number"
                min={0}
                value={form.yearsOfExperience}
                onChange={(e) =>
                  updateField("yearsOfExperience", e.target.value)
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-city" className="text-xs">
                City
              </Label>
              <Input
                id="dev-city"
                value={form.locationCity}
                onChange={(e) => updateField("locationCity", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-state" className="text-xs">
                State / Country
              </Label>
              <Input
                id="dev-state"
                value={form.locationState}
                onChange={(e) => updateField("locationState", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Availability</Label>
              <Select
                value={form.availability}
                onValueChange={(v) => updateField("availability", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="2_weeks">2 Weeks</SelectItem>
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Currency</Label>
              <Select
                value={form.salaryCurrency}
                onValueChange={(v) => updateField("salaryCurrency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dev-hourly" className="text-xs">
                Hourly Rate
              </Label>
              <Input
                id="dev-hourly"
                type="number"
                min={0}
                value={form.hourlyRate}
                onChange={(e) => updateField("hourlyRate", e.target.value)}
                className="font-mono"
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dev-monthly" className="text-xs">
                Monthly Rate
              </Label>
              <Input
                id="dev-monthly"
                type="number"
                min={0}
                value={form.monthlyRate}
                onChange={(e) => updateField("monthlyRate", e.target.value)}
                className="font-mono"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            disabled={submitting || !form.email.trim()}
            className="gap-2"
            onClick={handleSubmit}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Add Developer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddDeveloperDialog };
