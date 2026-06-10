"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ArrowRight, Loader2, Phone, Video } from "lucide-react";

import { requestMarketplaceInterview } from "@/lib/api/companies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface RailDeveloper {
  id: string;
  name: string;
}

interface OpenRole {
  id: string;
  title: string;
}

interface InterviewRequestContextValue {
  open: (developer: RailDeveloper) => void;
  isRequested: (developerId: string) => boolean;
}

const InterviewRequestContext =
  createContext<InterviewRequestContextValue | null>(null);

const GENERAL = "__general";
const TYPES = [
  { id: "video", label: "Video", icon: Video },
  { id: "phone", label: "Phone", icon: Phone },
] as const;

export function InterviewRequestProvider({
  roles,
  children,
}: {
  roles: OpenRole[];
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const [dev, setDev] = useState<RailDeveloper | null>(null);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const [roleId, setRoleId] = useState<string>(GENERAL);
  const [type, setType] = useState<"video" | "phone">("video");
  const [note, setNote] = useState("");
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRoleId(GENERAL);
    setType("video");
    setNote("");
    setAvailability("");
  };

  const open = (developer: RailDeveloper) => {
    reset();
    setDev(developer);
  };

  const submit = async () => {
    if (!dev) return;
    setSubmitting(true);
    const token = await getToken();
    const ok = await requestMarketplaceInterview(token, {
      developerId: dev.id,
      requirementId: roleId === GENERAL ? null : roleId,
      type,
      note: note.trim() || undefined,
      availabilityNote: availability.trim() || undefined,
      companyTimezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    });
    setSubmitting(false);
    if (!ok) {
      toast.error("Couldn't send the request — please try again.");
      return;
    }
    setRequested((prev) => new Set(prev).add(dev.id));
    toast.success(
      "Request sent — your account manager will line up the interview.",
    );
    setDev(null);
  };

  return (
    <InterviewRequestContext.Provider
      value={{ open, isRequested: (id) => requested.has(id) }}
    >
      {children}

      <Dialog open={!!dev} onOpenChange={(o) => !o && setDev(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request an interview</DialogTitle>
            <DialogDescription>
              {dev
                ? `We'll pass this to your account manager, who lines up the interview with ${dev.name.split(" ")[0]}.`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">For which role?</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GENERAL}>General interest</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Interview type</Label>
              <div className="inline-flex gap-2">
                {TYPES.map((t) => {
                  const Icon = t.icon;
                  const on = type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                        on
                          ? "border-pulse/45 bg-pulse/10 font-medium text-pulse"
                          : "border-border text-muted-foreground hover:border-pulse/30",
                      )}
                    >
                      <Icon className="size-3.5" /> {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                What would you like to cover? <span className="opacity-60">(optional)</span>
              </Label>
              <Textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A bit about the role, what you want to assess…"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Your availability <span className="opacity-60">(optional)</span>
              </Label>
              <Textarea
                rows={2}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. weekday mornings ET, or 'flexible — propose times'"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDev(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={submit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InterviewRequestContext.Provider>
  );
}

export function useInterviewRequest(): InterviewRequestContextValue {
  const ctx = useContext(InterviewRequestContext);
  if (!ctx) {
    return { open: () => {}, isRequested: () => false };
  }
  return ctx;
}
