"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2, Pencil, ShieldCheck, Trash2 } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface Admin {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phone: string | null;
  profilePhotoUrl: string | null;
  isSuperAdmin: boolean;
  createdAt: string;
}

interface TeamListProps {
  admins: Admin[];
  currentUserId: string;
  token: string;
  currentUserIsSuperAdmin: boolean;
}

function TeamList({ admins, currentUserId, token, currentUserIsSuperAdmin }: TeamListProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmAdmin, setConfirmAdmin] = useState<Admin | null>(null);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [togglingSuper, setTogglingSuper] = useState<string | null>(null);

  const openEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setEditForm({
      firstName: admin.firstName ?? "",
      lastName: admin.lastName ?? "",
      phone: admin.phone ?? "",
    });
    setEditPhoto(null);
    setEditPhotoPreview(null);
    setError(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPhoto(file);
    setEditPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    if (!editAdmin) return;
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("firstName", editForm.firstName);
      formData.append("lastName", editForm.lastName);
      formData.append("phone", editForm.phone);
      if (editPhoto) {
        formData.append("profilePhoto", editPhoto);
      }

      const response = await fetch(
        `${apiBaseUrl}/api/admin/team/${editAdmin.clerkUserId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to update");
      }

      toast.success("Team member updated");
      setEditAdmin(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirmAdmin) return;
    setRemoving(confirmAdmin.clerkUserId);
    setError(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/team/${confirmAdmin.clerkUserId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to remove admin");
      }

      toast.success("Admin removed");
      setConfirmAdmin(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove admin");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRemoving(null);
    }
  };

  const handleToggleSuperAdmin = async (admin: Admin) => {
    setTogglingSuper(admin.clerkUserId);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/team/${admin.clerkUserId}/super-admin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isSuperAdmin: !admin.isSuperAdmin }),
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to update");
      }

      toast.success(admin.isSuperAdmin ? "Demoted from super admin" : "Promoted to super admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTogglingSuper(null);
    }
  };

  if (admins.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No admins found.</p>
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {admins.map((admin) => {
          const fullName =
            [admin.firstName, admin.lastName].filter(Boolean).join(" ") ||
            "Admin";
          const initials = fullName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          const isCurrentUser = admin.clerkUserId === currentUserId;
          const photoUrl = admin.profilePhotoUrl || admin.imageUrl;

          return (
            <div
              key={admin.clerkUserId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar size="sm">
                {photoUrl && (
                  <AvatarImage src={photoUrl} alt={fullName} />
                )}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">
                    {fullName}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </p>
                  {admin.isSuperAdmin && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-pulse/40 bg-pulse/10 text-pulse text-[10px] px-1.5 py-0"
                    >
                      <ShieldCheck className="size-3" />
                      Super Admin
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {admin.email}
                </p>
                {admin.phone && (
                  <p className="truncate text-xs text-muted-foreground">
                    {admin.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                {currentUserIsSuperAdmin && (
                  <Button
                    variant={admin.isSuperAdmin ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    disabled={isCurrentUser || togglingSuper === admin.clerkUserId}
                    onClick={() => handleToggleSuperAdmin(admin)}
                  >
                    {togglingSuper === admin.clerkUserId ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : admin.isSuperAdmin ? (
                      "Demote"
                    ) : (
                      "Promote"
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => openEdit(admin)}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  disabled={isCurrentUser}
                  onClick={() => {
                    setError(null);
                    setConfirmAdmin(admin);
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {/* Edit Dialog */}
      <Dialog
        open={!!editAdmin}
        onOpenChange={(open) => {
          if (!open) {
            setEditAdmin(null);
            setError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update profile details for{" "}
              <span className="font-medium text-foreground">
                {editAdmin?.email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-16">
                  {(editPhotoPreview || editAdmin?.profilePhotoUrl || editAdmin?.imageUrl) && (
                    <AvatarImage
                      src={editPhotoPreview || editAdmin?.profilePhotoUrl || editAdmin?.imageUrl || ""}
                      alt="Profile"
                    />
                  )}
                  <AvatarFallback className="text-lg">
                    {editForm.firstName?.[0]?.toUpperCase() ?? "A"}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 rounded-full border bg-background p-1 shadow-sm hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="size-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Click the camera icon to upload a profile photo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                placeholder="+44 7911 123456"
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditAdmin(null);
                setError(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={saving || !editForm.firstName.trim()}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={!!confirmAdmin}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmAdmin(null);
            setError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">
                {confirmAdmin?.email}
              </span>{" "}
              from the admin team? They will lose access to the dashboard.
            </DialogDescription>
          </DialogHeader>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmAdmin(null);
                setError(null);
              }}
              disabled={!!removing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={!!removing}
            >
              {removing ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { TeamList };
