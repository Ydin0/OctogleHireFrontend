"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ExternalLink, Loader2, Send, UserCheck } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type InterviewStatus,
  interviewStatusLabel,
  interviewStatusBadgeClass,
  formatDate,
  getInitials,
} from "../_components/dashboard-data";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface Interview {
  id: string;
  matchId: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerAvatar: string | null;
  companyId: string;
  companyName: string;
  requirementTitle: string;
  type: "video" | "phone" | "in_person";
  meetingLink: string | null;
  location: string | null;
  status: InterviewStatus;
  outcome: string | null;
  scheduledAt: string | null;
  selectedSlot: string | null;
  proposedSlots: Array<{ start: string; end: string }> | null;
  alternativeSlots: Array<{ start: string; end: string }> | null;
  adminHostId: string | null;
  adminHostName: string | null;
  adminNotes: string | null;
  companyNotes: string | null;
  companyRating: number | null;
  createdAt: string;
}

const typeLabel: Record<string, string> = {
  video: "Video",
  phone: "Phone",
  in_person: "In Person",
};

const typeBadgeClass: Record<string, string> = {
  video: "bg-sky-500/10 text-sky-600 border-sky-600/20",
  phone: "bg-amber-500/10 text-amber-700 border-amber-600/20",
  in_person: "bg-violet-500/10 text-violet-600 border-violet-600/20",
};

export default function InterviewsPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Setup dialog state
  const [setupDialog, setSetupDialog] = useState<Interview | null>(null);
  const [setupMeetingLink, setSetupMeetingLink] = useState("");
  const [setupLocation, setSetupLocation] = useState("");
  const [setupHostName, setSetupHostName] = useState("");
  const [setupNotes, setSetupNotes] = useState("");
  const [setupSaving, setSetupSaving] = useState(false);

  const loadInterviews = useCallback(
    async (status: string) => {
      setLoading(true);
      try {
        const token = await getToken();
        const params = new URLSearchParams();
        if (status && status !== "all") {
          params.set("status", status);
        }
        const url = `${apiBaseUrl}/api/admin/interviews${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.interviews ?? data ?? []);
        }
      } finally {
        setLoading(false);
      }
    },
    [getToken],
  );

  useEffect(() => {
    loadInterviews(statusFilter);
  }, [statusFilter, loadInterviews]);

  const openSetupDialog = (interview: Interview) => {
    setSetupDialog(interview);
    setSetupMeetingLink(interview.meetingLink ?? "");
    setSetupLocation(interview.location ?? "");
    setSetupHostName(interview.adminHostName ?? (user?.fullName ?? ""));
    setSetupNotes(interview.adminNotes ?? "");
  };

  const handleSetup = async () => {
    if (!setupDialog) return;
    setSetupSaving(true);

    const token = await getToken();

    // Use setup endpoint for confirmed interviews, regular patch otherwise
    const isSetup = setupDialog.status === "confirmed";
    const url = isSetup
      ? `${apiBaseUrl}/api/admin/interviews/${setupDialog.id}/setup`
      : `${apiBaseUrl}/api/admin/interviews/${setupDialog.id}`;

    await fetch(url, {
      method: isSetup ? "POST" : "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetingLink: setupMeetingLink || undefined,
        location: setupLocation || undefined,
        adminHostName: setupHostName,
        adminNotes: setupNotes || undefined,
      }),
    });

    setSetupSaving(false);
    setSetupDialog(null);
    loadInterviews(statusFilter);
  };

  const needsSetup = (i: Interview) =>
    i.status === "confirmed" && !i.meetingLink && !i.location;

  const confirmedCount = interviews.filter((i) => i.status === "confirmed").length;
  const needsSetupCount = interviews.filter(needsSetup).length;

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Interviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage all platform interviews. Set up meetings and assign hosts.
        </p>
      </div>

      {needsSetupCount > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-3">
            <Send className="size-4 text-amber-600" />
            <p className="text-sm">
              <strong className="font-semibold">{needsSetupCount}</strong> interview{needsSetupCount !== 1 ? "s" : ""} confirmed and awaiting meeting setup.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="rescheduled">Rescheduled</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2 text-xs text-muted-foreground">
          <span>{interviews.length} total</span>
          {confirmedCount > 0 && (
            <span className="text-sky-600">{confirmedCount} confirmed</span>
          )}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading interviews...
            </span>
          </CardContent>
        </Card>
      ) : interviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No interviews found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Developer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7 shrink-0">
                          <AvatarImage
                            src={interview.developerAvatar ?? undefined}
                            alt={interview.developerName}
                          />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(interview.developerName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm font-medium">
                          {interview.developerName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{interview.companyName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="max-w-[180px] truncate text-sm">
                        {interview.requirementTitle}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={typeBadgeClass[interview.type] ?? ""}
                      >
                        {typeLabel[interview.type] ?? interview.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={interviewStatusBadgeClass(interview.status)}
                        >
                          {interviewStatusLabel[interview.status]}
                        </Badge>
                        {needsSetup(interview) && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-600/20 text-[10px]">
                            Needs Setup
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {interview.adminHostName ? (
                        <div className="flex items-center gap-1 text-sm">
                          <UserCheck className="size-3 text-emerald-600" />
                          {interview.adminHostName}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {interview.scheduledAt ? (
                        <span className="font-mono text-xs">
                          {formatDate(interview.scheduledAt)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {interview.meetingLink && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="size-7 p-0"
                            asChild
                          >
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="size-3.5" />
                            </a>
                          </Button>
                        )}
                        {["confirmed", "requested", "rescheduled"].includes(interview.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => openSetupDialog(interview)}
                          >
                            {needsSetup(interview) ? "Set Up" : "Edit"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={setupDialog !== null}
        onOpenChange={(open) => {
          if (!open) setSetupDialog(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Up Interview</DialogTitle>
            <DialogDescription>
              {setupDialog && (
                <>
                  {setupDialog.developerName} &times; {setupDialog.companyName}
                  {setupDialog.scheduledAt && (
                    <> &mdash; {new Date(setupDialog.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {new Date(setupDialog.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admin Host (you or team member)
              </Label>
              <Input
                value={setupHostName}
                onChange={(e) => setSetupHostName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            {setupDialog?.type === "in_person" ? (
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Location
                </Label>
                <Input
                  value={setupLocation}
                  onChange={(e) => setSetupLocation(e.target.value)}
                  placeholder="Office address or meeting room"
                />
              </div>
            ) : (
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Meeting Link
                </Label>
                <Input
                  type="url"
                  value={setupMeetingLink}
                  onChange={(e) => setSetupMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}

            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Internal Notes
              </Label>
              <Textarea
                value={setupNotes}
                onChange={(e) => setSetupNotes(e.target.value)}
                placeholder="Any prep notes, context for the interview..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupDialog(null)}>
              Cancel
            </Button>
            <Button
              disabled={
                setupSaving ||
                !setupHostName ||
                (!setupMeetingLink && !setupLocation)
              }
              onClick={handleSetup}
            >
              {setupSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {setupDialog?.status === "confirmed" && !setupDialog.meetingLink && !setupDialog.location
                ? "Set Up & Notify All"
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
