"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { AdminApplication } from "@/lib/api/admin";

interface QuickNoteDialogProps {
  application: AdminApplication | null;
  token: string;
  onClose: () => void;
}

function QuickNoteDialog({ application, token, onClose }: QuickNoteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || !application) return;

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/applications/${application.id}/notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content.trim(),
            stage: application.status,
          }),
        }
      );

      if (response.ok) {
        setContent("");
        onClose();
        startTransition(() => {
          router.refresh();
        });
      }
    } catch {
      // Error handling kept simple
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={!!application} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            {application?.fullName ?? "Unknown"} &mdash;{" "}
            {application?.professionalTitle ?? "No title"}
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !content.trim()}
          >
            {isPending ? "Adding..." : "Add Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QuickNoteDialog };
