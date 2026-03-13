"use client";

import { useEffect, useState, useRef } from "react";
import {
  Camera,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

import {
  fetchCompanyTeam,
  inviteCompanyTeamMember,
  removeCompanyTeamMember,
  updateCompanyTeamMember,
  uploadTeamMemberAvatar,
  type TeamMember,
} from "@/lib/api/companies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const roleLabels: Record<string, string> = {
  Admin: "Admin",
  Member: "Member",
  "Hiring Manager": "Hiring Manager",
};

const roleBadgeClass: Record<string, string> = {
  Admin: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  "Hiring Manager": "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  Member: "",
};

// ── Edit Dialog ──────────────────────────────────────────────────────────────

function EditMemberDialog({
  member,
  onSave,
  onAvatarUpload,
}: {
  member: TeamMember;
  onSave: (memberId: string, updates: { name?: string; email?: string; phone?: string; title?: string; role?: string }) => Promise<void>;
  onAvatarUpload: (memberId: string, file: File) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [phone, setPhone] = useState(member.phone ?? "");
  const [title, setTitle] = useState(member.title ?? "");
  const [role, setRole] = useState(member.role);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      await onSave(member.id, { name, email, phone, title, role });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onAvatarUpload(member.id, file);
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setName(member.name);
          setEmail(member.email);
          setPhone(member.phone ?? "");
          setTitle(member.title ?? "");
          setRole(member.role);
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>Update {member.name}&apos;s information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar>
                {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-accent text-muted-foreground transition-colors hover:bg-accent/80"
              >
                {uploading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Camera className="size-3" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Click camera icon to update photo
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Job Title</Label>
              <Input id="edit-title" placeholder="e.g. CTO, VP Engineering" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="edit-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !name.trim() || !email.trim()}>
            {saving && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const TeamPage = () => {
  const { getToken } = useAuth();
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Invite dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteTitle, setInviteTitle] = useState("");
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
    loadTeam();
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
        phone: invitePhone.trim() || undefined,
        title: inviteTitle.trim() || undefined,
      });
      setDialogOpen(false);
      setInviteName("");
      setInviteEmail("");
      setInvitePhone("");
      setInviteTitle("");
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

  const handleSave = async (
    memberId: string,
    updates: { name?: string; email?: string; phone?: string; title?: string; role?: string },
  ) => {
    const token = await getToken();
    const updated = await updateCompanyTeamMember(token, memberId, updates);
    setTeam((prev) => prev?.map((m) => (m.id === memberId ? updated : m)) ?? null);
  };

  const handleAvatarUpload = async (memberId: string, file: File) => {
    const token = await getToken();
    const avatarUrl = await uploadTeamMemberAvatar(token, memberId, file);
    setTeam((prev) =>
      prev?.map((m) => (m.id === memberId ? { ...m, avatar: avatarUrl } : m)) ?? null,
    );
  };

  const members = team ?? [];

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Team</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members, roles, and permissions.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setInviteError("");
          }}
        >
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
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="invite-title">Job Title</Label>
                  <Input
                    id="invite-title"
                    placeholder="e.g. CTO, VP Engineering"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="invite-phone">Phone</Label>
                  <Input
                    id="invite-phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Hiring Managers can be assigned to requirements and conduct interviews.
                </p>
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {member.avatar && (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          )}
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.name}</p>
                          {member.title && (
                            <p className="truncate text-xs text-muted-foreground">{member.title}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        {member.phone && (
                          <p className="text-xs text-muted-foreground">{member.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={roleBadgeClass[member.role] ?? ""}
                      >
                        {roleLabels[member.role] ?? member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(member.joinedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditMemberDialog
                          member={member}
                          onSave={handleSave}
                          onAvatarUpload={handleAvatarUpload}
                        />
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
                      </div>
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
