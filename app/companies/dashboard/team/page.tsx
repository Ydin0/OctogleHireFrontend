"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import { getInitials } from "../_components/dashboard-data";
import {
  fetchCompanyTeam,
  inviteCompanyTeamMember,
  removeCompanyTeamMember,
  type TeamMember,
} from "@/lib/api/companies";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TeamPage = () => {
  const { getToken } = useAuth();
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // Remove state
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadTeam = async () => {
    const token = await getToken();
    const data = await fetchCompanyTeam(token);
    setTeam(data);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadTeam();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [getToken]);

  const handleInvite = async () => {
    setInviteError("");
    setInviting(true);
    try {
      const token = await getToken();
      await inviteCompanyTeamMember(token, {
        email: inviteEmail.trim(),
        name: inviteName.trim(),
        role: inviteRole,
      });
      setDialogOpen(false);
      setInviteName("");
      setInviteEmail("");
      setInviteRole("Member");
      await loadTeam();
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setRemovingId(memberId);
    try {
      const token = await getToken();
      await removeCompanyTeamMember(token, memberId);
      await loadTeam();
    } finally {
      setRemovingId(null);
    }
  };

  const members = team ?? [];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Team</h1>
          <p className="text-sm text-muted-foreground">
            Team members in your company workspace.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setInviteError(""); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1.5 size-4" />
              Invite Member
            </Button>
          </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    They&apos;ll receive a welcome email and can sign in immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="invite-name">Name</Label>
                    <Input
                      id="invite-name"
                      placeholder="Jane Smith"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="jane@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {inviteError && (
                    <p className="text-sm text-destructive">{inviteError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleInvite}
                    disabled={inviting || !inviteName.trim() || !inviteEmail.trim()}
                  >
                    {inviting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                    Send Invite
                  </Button>
                </DialogFooter>
              </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">No team members yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Team members will appear here once they are added to your company workspace.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(member.id)}
                        disabled={removingId === member.id}
                      >
                        {removingId === member.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TeamPage;
