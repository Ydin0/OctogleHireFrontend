"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Check,
  GraduationCap,
  Linkedin,
  Loader2,
  Plus,
  Link2,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  addAgencyCandidate,
  checkAgencyCandidateEmail,
  claimAgencyCandidate,
  type EmailCheckResult,
  type EmailCheckStatus,
} from "@/lib/api/agencies";
import {
  fetchLinkedInProfile,
  mapProfileToFormValues,
  type ApifyProfile,
  type LinkedInFormValues,
} from "@/lib/linkedin";
import type { WorkExperience, Education } from "@/lib/schemas/application";
import { TechStackSelector } from "@/app/apply/_components/tech-stack-selector";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ── Types ────────────────────────────────────────────────────────────────────

type Step = "linkedin" | "form";

interface FormState {
  fullName: string;
  email: string;
  professionalTitle: string;
  bio: string;
  primaryStack: string[];
  secondarySkills: string;
  yearsOfExperience: string;
  locationCity: string;
  locationState: string;
  availability: string;
  englishProficiency: string;
  salaryCurrency: string;
  hourlyRate: string;
  monthlyRate: string;
  linkedinUrl: string;
  profilePhotoUrl: string;
  workExperience: WorkExperience[];
  education: Education[];
}

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  professionalTitle: "",
  bio: "",
  primaryStack: [],
  secondarySkills: "",
  yearsOfExperience: "",
  locationCity: "",
  locationState: "",
  availability: "immediately",
  englishProficiency: "",
  salaryCurrency: "USD",
  hourlyRate: "",
  monthlyRate: "",
  linkedinUrl: "",
  profilePhotoUrl: "",
  workExperience: [],
  education: [],
};

// ── Email status display ─────────────────────────────────────────────────────

const EMAIL_STATUS_CONFIG: Record<
  Exclude<EmailCheckStatus, "available">,
  { className: string; message: (name?: string | null) => string }
> = {
  own_agency: {
    className: "text-yellow-600",
    message: () => "Already in your pool.",
  },
  direct_claimable: {
    className: "text-blue-600",
    message: (name) =>
      `${name ?? "This candidate"} applied directly. Link to your agency?`,
  },
  other_agency: {
    className: "text-red-600",
    message: () => "Already represented by another agency.",
  },
};

// ── Component ────────────────────────────────────────────────────────────────

const AddDeveloperDialog = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("linkedin");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // LinkedIn import
  const [linkedinInput, setLinkedinInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importedProfile, setImportedProfile] = useState<ApifyProfile | null>(null);

  // Email check
  const [emailCheck, setEmailCheck] = useState<EmailCheckResult | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const emailCheckTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Helpers ──────────────────────────────────────────────────────────────

  const reset = () => {
    setStep("linkedin");
    setForm(INITIAL_FORM);
    setLinkedinInput("");
    setImporting(false);
    setImportError("");
    setImportedProfile(null);
    setEmailCheck(null);
    setEmailChecking(false);
    setClaiming(false);
    setSubmitting(false);
    setSubmitError("");
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── LinkedIn import ──────────────────────────────────────────────────────

  const handleImport = async () => {
    const url = linkedinInput.trim();
    if (!url || !url.includes("linkedin.com")) {
      setImportError("Please enter a valid LinkedIn URL.");
      return;
    }

    setImporting(true);
    setImportError("");

    try {
      const profile = await fetchLinkedInProfile(url);
      const values = mapProfileToFormValues(profile, url);

      setImportedProfile(profile);

      // Resolve photo URL
      const photoUrl =
        (profile._profilePhotoR2Url as string | undefined) ??
        (profile.profilePicHighQuality as string | undefined) ??
        (profile.profilePic as string | undefined) ??
        (profile.profilePicture as string | undefined) ??
        "";

      setForm({
        ...INITIAL_FORM,
        fullName: values.fullName ?? "",
        professionalTitle: values.professionalTitle ?? "",
        bio: values.bio ?? "",
        primaryStack: values.primaryStack ?? [],
        secondarySkills: values.secondarySkills ?? "",
        locationCity: values.locationCity ?? "",
        locationState: values.locationState ?? "",
        linkedinUrl: url,
        profilePhotoUrl: photoUrl,
        workExperience: values.workExperience ?? [],
        education: values.education ?? [],
      });

      setStep("form");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleSkip = () => {
    setImportedProfile(null);
    setForm(INITIAL_FORM);
    setStep("form");
  };

  // ── Email duplicate check ────────────────────────────────────────────────

  const runEmailCheck = useCallback(
    async (email: string) => {
      const trimmed = email.trim();
      if (!trimmed || !trimmed.includes("@")) {
        setEmailCheck(null);
        return;
      }

      setEmailChecking(true);
      try {
        const token = await getToken();
        const result = await checkAgencyCandidateEmail(token, trimmed);
        setEmailCheck(result);
      } catch {
        setEmailCheck(null);
      } finally {
        setEmailChecking(false);
      }
    },
    [getToken],
  );

  const handleEmailBlur = () => {
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);
    runEmailCheck(form.email);
  };

  const handleEmailChange = (value: string) => {
    updateField("email", value);
    setEmailCheck(null);
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);
    emailCheckTimer.current = setTimeout(() => runEmailCheck(value), 800);
  };

  // ── Claim direct applicant ───────────────────────────────────────────────

  const handleClaim = async () => {
    if (!emailCheck?.candidateId) return;
    setClaiming(true);
    try {
      const token = await getToken();
      await claimAgencyCandidate(token, emailCheck.candidateId);
      setOpen(false);
      reset();
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Claim failed.");
    } finally {
      setClaiming(false);
    }
  };

  // ── Submit new candidate ─────────────────────────────────────────────────

  const canSubmit =
    form.email.trim() &&
    !submitting &&
    !emailChecking &&
    (!emailCheck || emailCheck.status === "available");

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const token = await getToken();

      await addAgencyCandidate(token, {
        fullName: form.fullName.trim() || undefined,
        email: form.email.trim(),
        professionalTitle: form.professionalTitle.trim() || undefined,
        bio: form.bio.trim() || undefined,
        primaryStack: form.primaryStack.length > 0 ? form.primaryStack : undefined,
        secondarySkills: form.secondarySkills.trim() || undefined,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        locationCity: form.locationCity.trim() || undefined,
        locationState: form.locationState.trim() || undefined,
        availability: form.availability || undefined,
        englishProficiency: form.englishProficiency || undefined,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        monthlyRate: form.monthlyRate ? Number(form.monthlyRate) : undefined,
        salaryCurrency: form.salaryCurrency,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        profilePhotoUrl: form.profilePhotoUrl.trim() || undefined,
        workExperience: form.workExperience.length > 0 ? form.workExperience : undefined,
        education: form.education.length > 0 ? form.education : undefined,
      });

      setOpen(false);
      reset();
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to add candidate.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const initials = form.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Developer
        </Button>
      </DialogTrigger>

      <DialogContent
        className={step === "form" ? "max-w-2xl" : "max-w-lg"}
      >
        {/* ── Step 1: LinkedIn import ─────────────────────────────────── */}
        {step === "linkedin" && (
          <>
            <DialogHeader>
              <DialogTitle>Add Developer</DialogTitle>
              <DialogDescription>
                Import from LinkedIn to auto-fill profile details, or skip to add manually.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin-url" className="text-xs">
                  LinkedIn Profile URL
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Linkedin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="linkedin-url"
                      value={linkedinInput}
                      onChange={(e) => {
                        setLinkedinInput(e.target.value);
                        setImportError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleImport();
                      }}
                      placeholder="https://linkedin.com/in/..."
                      className="pl-9"
                      disabled={importing}
                    />
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={importing || !linkedinInput.trim()}
                    className="gap-2"
                  >
                    {importing && <Loader2 className="size-4 animate-spin" />}
                    Import Profile
                  </Button>
                </div>
              </div>

              {importing && (
                <p className="text-sm text-muted-foreground">
                  Importing... This may take a moment.
                </p>
              )}

              {importError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="size-4 shrink-0" />
                  {importError}
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip — add manually
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 2: Review & Complete ───────────────────────────────── */}
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {importedProfile ? "Review & Complete" : "Add Developer"}
              </DialogTitle>
              <DialogDescription>
                {importedProfile
                  ? "Review the imported data and fill in any remaining fields."
                  : "Manually add a developer to your candidate pool."}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-3">
              <div className="space-y-5 pb-1">
                {/* Profile header */}
                {importedProfile && form.fullName && (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="size-12">
                      <AvatarImage src={form.profilePhotoUrl} alt={form.fullName} />
                      <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold leading-tight">
                        {form.fullName}
                      </p>
                      {form.professionalTitle && (
                        <p className="text-sm text-muted-foreground truncate">
                          {form.professionalTitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Basic info */}
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
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={handleEmailBlur}
                      placeholder="jane@example.com"
                      required
                    />
                    {emailChecking && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2 className="size-3 animate-spin" />
                        Checking...
                      </p>
                    )}
                    {emailCheck && emailCheck.status === "available" && (
                      <p className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="size-3" />
                        Available
                      </p>
                    )}
                    {emailCheck && emailCheck.status !== "available" && (
                      <div className="space-y-1.5">
                        <p className={`flex items-center gap-1 text-xs ${EMAIL_STATUS_CONFIG[emailCheck.status].className}`}>
                          <AlertCircle className="size-3 shrink-0" />
                          {EMAIL_STATUS_CONFIG[emailCheck.status].message(emailCheck.candidateName)}
                        </p>
                        {emailCheck.status === "direct_claimable" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={handleClaim}
                            disabled={claiming}
                          >
                            {claiming ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <Link2 className="size-3" />
                            )}
                            Link to My Agency
                          </Button>
                        )}
                      </div>
                    )}
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

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="dev-bio" className="text-xs">
                    Bio
                  </Label>
                  <Textarea
                    id="dev-bio"
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Brief professional summary..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Tech stack */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Tech Stack</Label>
                  <TechStackSelector
                    value={form.primaryStack}
                    onChange={(v) => updateField("primaryStack", v)}
                    max={8}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dev-secondary" className="text-xs">
                    Secondary Skills
                  </Label>
                  <Input
                    id="dev-secondary"
                    value={form.secondarySkills}
                    onChange={(e) => updateField("secondarySkills", e.target.value)}
                    placeholder="Project management, Agile, etc."
                  />
                </div>

                {/* Location / experience row */}
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
                      onChange={(e) => updateField("yearsOfExperience", e.target.value)}
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

                {/* Selects row */}
                <div className="grid grid-cols-3 gap-3">
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
                    <Label className="text-xs">English Proficiency</Label>
                    <Select
                      value={form.englishProficiency}
                      onValueChange={(v) => updateField("englishProficiency", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
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

                {/* Rate row */}
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

                {/* Work experience preview */}
                {form.workExperience.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Work Experience
                    </p>
                    <div className="space-y-2">
                      {form.workExperience.map((exp, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          {exp.companyLogoUrl ? (
                            <img
                              src={exp.companyLogoUrl}
                              alt=""
                              className="size-8 rounded object-contain"
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded bg-muted">
                              <Briefcase className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-tight">
                              {exp.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {exp.company}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {exp.startDate}
                              {exp.startDate && (exp.endDate || exp.current) && " — "}
                              {exp.current ? "Present" : exp.endDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education preview */}
                {form.education.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Education
                    </p>
                    <div className="space-y-2">
                      {form.education.map((edu, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          {edu.institutionLogoUrl ? (
                            <img
                              src={edu.institutionLogoUrl}
                              alt=""
                              className="size-8 rounded object-contain"
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded bg-muted">
                              <GraduationCap className="size-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-tight">
                              {edu.institution}
                            </p>
                            {edu.degree && (
                              <p className="text-xs text-muted-foreground">
                                {edu.degree}
                              </p>
                            )}
                            {(edu.startYear || edu.endYear) && (
                              <p className="text-xs text-muted-foreground">
                                {edu.startYear}
                                {edu.startYear && edu.endYear && " — "}
                                {edu.endYear}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills badges (from LinkedIn secondary) */}
                {form.secondarySkills && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      LinkedIn Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.secondarySkills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .slice(0, 20)
                        .map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="size-4 shrink-0" />
                    {submitError}
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  if (importedProfile) {
                    setStep("linkedin");
                  } else {
                    setOpen(false);
                  }
                }}
                disabled={submitting}
              >
                {importedProfile ? "Back" : "Cancel"}
              </Button>
              <Button
                disabled={!canSubmit}
                className="gap-2"
                onClick={handleSubmit}
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Add Developer
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { AddDeveloperDialog };
