"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  createSalesRepApplicationNote,
  updateSalesRepApplicationNote,
  deleteSalesRepApplicationNote,
  type SalesRepApplicationNote,
} from "@/lib/api/admin-sales-rep";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface NotesSectionProps {
  applicationId: string;
  notes: SalesRepApplicationNote[];
  token: string;
  currentUserId: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotesSection({
  applicationId,
  notes,
  token,
  currentUserId,
}: NotesSectionProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsAdding(true);
    try {
      const result = await createSalesRepApplicationNote(
        token,
        applicationId,
        newNote.trim()
      );
      if (!result) throw new Error("Failed to add note");
      toast.success("Note added");
      setNewNote("");
      startTransition(() => router.refresh());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add note";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editingContent.trim()) return;
    try {
      const result = await updateSalesRepApplicationNote(
        token,
        applicationId,
        noteId,
        editingContent.trim()
      );
      if (!result) throw new Error("Failed to update note");
      toast.success("Note updated");
      setEditingId(null);
      startTransition(() => router.refresh());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update note";
      toast.error(msg);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      const ok = await deleteSalesRepApplicationNote(
        token,
        applicationId,
        noteId
      );
      if (!ok) throw new Error("Failed to delete note");
      toast.success("Note deleted");
      startTransition(() => router.refresh());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete note";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this candidate..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={isAdding || !newNote.trim()}
            onClick={handleAddNote}
            className="rounded-full"
          >
            {isAdding ? "Adding..." : "Add Note"}
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => {
            const isAuthor = note.authorClerkUserId === currentUserId;
            const isEditing = editingId === note.id;
            const isSystem = note.authorClerkUserId === "system";

            return (
              <Card key={note.id}>
                <CardContent className="space-y-2 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {note.authorName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </span>
                      {note.stage && (
                        <span className="text-[10px] text-muted-foreground">
                          · {note.stage.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                    {isAuthor && !isSystem && !isEditing && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => {
                            setEditingId(note.id);
                            setEditingContent(note.content);
                          }}
                        >
                          <Pencil className="size-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(note.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">
                      {note.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { NotesSection };
