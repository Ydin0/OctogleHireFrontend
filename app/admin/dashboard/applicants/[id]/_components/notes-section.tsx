"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApplicationNote } from "@/lib/api/admin";
import {
  type ApplicationStatus,
  ALL_STATUSES,
  applicationStatusLabel,
  applicationStatusBadgeClass,
} from "../../../_components/dashboard-data";

interface NotesSectionProps {
  applicationId: string;
  currentStatus: string;
  notes: ApplicationNote[];
  token: string;
  currentUserId?: string;
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function NotesSection({
  applicationId,
  currentStatus,
  notes,
  token,
  currentUserId,
}: NotesSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [stage, setStage] = useState(currentStatus);

  // Edit state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Delete confirmation state
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content.trim(),
            stage,
          }),
        }
      );

      if (response.ok) {
        setContent("");
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Error handling kept simple
    }
  };

  const handleEdit = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/notes/${noteId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editContent.trim() }),
        }
      );

      if (response.ok) {
        setEditingNoteId(null);
        setEditContent("");
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Error handling kept simple
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setDeleteNoteId(null);
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Error handling kept simple
    }
  };

  const startEditing = (note: ApplicationNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent("");
  };

  const groupedNotes = notes.reduce<Record<string, ApplicationNote[]>>(
    (acc, note) => {
      const key = note.stage;
      if (!acc[key]) acc[key] = [];
      acc[key].push(note);
      return acc;
    },
    {}
  );

  const isSystem = (note: ApplicationNote) =>
    note.authorClerkUserId === "system";

  const isOwner = (note: ApplicationNote) =>
    currentUserId ? note.authorClerkUserId === currentUserId : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Textarea
            placeholder="Add a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex items-center gap-3">
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {applicationStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
              size="sm"
            >
              {isPending ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </div>

        {Object.keys(groupedNotes).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No notes yet. Add the first note above.
          </p>
        )}

        {Object.entries(groupedNotes).map(([stageKey, stageNotes]) => (
          <div key={stageKey} className="space-y-3">
            <Badge
              variant="outline"
              className={applicationStatusBadgeClass(
                stageKey as ApplicationStatus
              )}
            >
              {applicationStatusLabel[stageKey as ApplicationStatus] ??
                stageKey}
            </Badge>
            {stageNotes.map((note) => {
              const systemNote = isSystem(note);
              const ownerNote = isOwner(note);

              if (systemNote) {
                return (
                  <div
                    key={note.id}
                    className="flex items-start gap-2 px-3 py-2"
                  >
                    <ArrowRight className="mt-0.5 size-3 text-muted-foreground/60 shrink-0" />
                    <div>
                      <p className="text-xs italic text-muted-foreground/80">
                        {note.content}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60">
                        {formatRelativeTime(note.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              }

              if (editingNoteId === note.id) {
                return (
                  <div
                    key={note.id}
                    className="rounded-lg border border-border/70 p-3 space-y-2"
                  >
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(note.id)}
                        disabled={isPending || !editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={note.id}
                  className="group relative rounded-lg border border-border/70 p-3"
                >
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{note.authorName}</span>
                    <span>&middot;</span>
                    <span>{formatRelativeTime(note.createdAt)}</span>
                    {note.createdAt !== note.updatedAt && (
                      <>
                        <span>&middot;</span>
                        <span className="italic">edited</span>
                      </>
                    )}
                  </div>

                  {ownerNote && (
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(note)}>
                            <Pencil className="mr-2 size-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteNoteId(note.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 size-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteNoteId}
        onOpenChange={(open) => !open && setDeleteNoteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteNoteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteNoteId && handleDelete(deleteNoteId)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export { NotesSection };
