"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Mail, Pencil, Plus, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

import {
  type AdminAgencyMember,
  fetchAdminAgencyMembers,
  inviteAdminAgencyMember,
  removeAdminAgencyMember,
  updateAdminAgencyMemberRole,
} from "@/lib/api/agencies";
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

const ROLES = ["owner", "admin", "member"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface AgencyMembersProps {
  agencyId: string;
}

export function AgencyMembers({ agencyId }: AgencyMembersProps) {
  const { getToken } = useAuth();
  const [members, setMembers] = useState<AdminAgencyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminAgencyMember | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "member" });
  const [editRole, setEditRole] = useState("member");

  const load = useCallback(async () => {
    const token = await getToken();
    const data = await fetchAdminAgencyMembers(token, agencyId);
    setMembers(data);
    setLoading(false);
  }, [getToken, agencyId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleInvite = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setInviting(true);
    const token = await getToken();
    const result = await inviteAdminAgencyMember(token, agencyId, inviteForm);
    if (result.success) {
      toast.success(`Invited ${inviteForm.name}`);
      setInviteForm({ name: "", email: "", role: "member" });
      setInviteOpen(false);
      await load();
    } else {
      toast.error(result.error ?? "Failed to invite member");
    }
    setInviting(false);
  };

  const handleUpdateRole = async () => {
    if (!editingMember) return;
    const token = await getToken();
    const ok = await updateAdminAgencyMemberRole(token, agencyId, editingMember.id, editRole);
    if (ok) {
      toast.success("Role updated");
      setEditingMember(null);
      await load();
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (memberId: string) => {
    setRemovingId(memberId);
    const token = await getToken();
    const ok = await removeAdminAgencyMember(token, agencyId, memberId);
    if (ok) {
      toast.success("Member removed");
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } else {
      toast.error("Failed to remove member");
    }
    setRemovingId(null);
    setConfirmRemoveId(null);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCheck className="size-4" />
          Team Members
          {!loading && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {members.length}
            </Badge>
          )}
        </CardTitle>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setInviteOpen(true)}
        >
          <Plus className="mr-1.5 size-3.5" />
          Invite Member
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No team members yet. Invite the first one to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              >
                <Avatar className="size-9 shrink-0">
                  {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
                  <AvatarFallback className="text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {member.role}
                    </Badge>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Joined {formatDate(member.joinedAt)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => {
                      setEditingMember(member);
                      setEditRole(member.role);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-red-600"
                    disabled={removingId === member.id}
                    onClick={() => setConfirmRemoveId(member.id)}
                  >
                    {removingId === member.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team member</DialogTitle>
            <DialogDescription>
              They will receive an email with a login link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="invite-name"
                placeholder="Jane Smith"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="jane@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-xs uppercase tracking-wider text-muted-foreground">
                Role
              </Label>
              <Select
                value={inviteForm.role}
                onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}
              >
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)} disabled={inviting}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={inviting}>
              {inviting && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit member role</DialogTitle>
            <DialogDescription>
              {editingMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="edit-role" className="text-xs uppercase tracking-wider text-muted-foreground">
              Role
            </Label>
            <Select value={editRole} onValueChange={setEditRole}>
              <SelectTrigger id="edit-role" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <Dialog open={!!confirmRemoveId} onOpenChange={(open) => !open && setConfirmRemoveId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              This will revoke their access to this agency. They will no longer be able to log in or manage candidates.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemoveId(null)}>
              <X className="mr-1.5 size-3.5" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmRemoveId && handleRemove(confirmRemoveId)}
              disabled={!!removingId}
            >
              {removingId ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 size-3.5" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
