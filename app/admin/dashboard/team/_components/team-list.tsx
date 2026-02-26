"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface Admin {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface TeamListProps {
  admins: Admin[];
  currentUserId: string;
  token: string;
}

function TeamList({ admins, currentUserId, token }: TeamListProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmAdmin, setConfirmAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        }
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to remove admin");
      }

      setConfirmAdmin(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRemoving(null);
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

          return (
            <div
              key={admin.clerkUserId}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar size="sm">
                {admin.imageUrl && (
                  <AvatarImage src={admin.imageUrl} alt={fullName} />
                )}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {fullName}
                  {isCurrentUser && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      (you)
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {admin.email}
                </p>
              </div>

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
          );
        })}
      </div>

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
