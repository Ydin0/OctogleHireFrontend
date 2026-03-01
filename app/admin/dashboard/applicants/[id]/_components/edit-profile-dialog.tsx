"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";

interface EditProfileDialogProps {
  applicationId: string;
  token: string;
  initialData: {
    email: string;
    fullName: string | null;
    phone: string | null;
    locationCity: string | null;
    locationState: string | null;
    professionalTitle: string | null;
    yearsOfExperience: number | null;
    bio: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    portfolioUrl: string | null;
    availability: string | null;
    englishProficiency: string | null;
    certifications: string | null;
  };
}

const AVAILABILITY_OPTIONS = ["immediate", "2-weeks", "1-month"] as const;
const ENGLISH_OPTIONS = ["basic", "conversational", "fluent", "native"] as const;

function EditProfileDialog({
  applicationId,
  token,
  initialData,
}: EditProfileDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState(initialData.email);
  const [fullName, setFullName] = useState(initialData.fullName ?? "");
  const [phone, setPhone] = useState(initialData.phone ?? "");
  const [locationCity, setLocationCity] = useState(initialData.locationCity ?? "");
  const [locationState, setLocationState] = useState(initialData.locationState ?? "");
  const [professionalTitle, setProfessionalTitle] = useState(initialData.professionalTitle ?? "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    initialData.yearsOfExperience?.toString() ?? ""
  );
  const [bio, setBio] = useState(initialData.bio ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData.githubUrl ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialData.portfolioUrl ?? "");
  const [availability, setAvailability] = useState(initialData.availability ?? "");
  const [englishProficiency, setEnglishProficiency] = useState(initialData.englishProficiency ?? "");
  const [certifications, setCertifications] = useState(initialData.certifications ?? "");

  const handleSave = async () => {
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    try {
      const payload: Record<string, unknown> = {
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        locationCity: locationCity.trim(),
        locationState: locationState.trim(),
        professionalTitle: professionalTitle.trim(),
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
        bio: bio.trim(),
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        availability: availability || null,
        englishProficiency: englishProficiency || null,
        certifications: certifications.trim(),
      };

      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(body?.message ?? "Failed to update profile");
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Developer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone + Title */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Professional Title</Label>
              <Input
                id="edit-title"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-state">State / Region</Label>
              <Input
                id="edit-state"
                value={locationState}
                onChange={(e) => setLocationState(e.target.value)}
              />
            </div>
          </div>

          {/* Experience + Availability + English */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-yoe">Years of Experience</Label>
              <Input
                id="edit-yoe"
                type="number"
                min="0"
                max="50"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Availability</Label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>English Proficiency</Label>
              <Select value={englishProficiency} onValueChange={setEnglishProficiency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {ENGLISH_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-bio">Bio</Label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-linkedin">LinkedIn URL</Label>
              <Input
                id="edit-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-github">GitHub URL</Label>
              <Input
                id="edit-github"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-portfolio">Portfolio URL</Label>
              <Input
                id="edit-portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-certifications">Certifications</Label>
            <Input
              id="edit-certifications"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { EditProfileDialog };
