"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Mail, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface VideoIntroButtonProps {
  applicationId: string;
  introVideoPath: string | null;
  applicantName: string;
  applicantEmail: string;
}

export function VideoIntroButton({
  applicationId,
  introVideoPath,
  applicantName,
  applicantEmail,
}: VideoIntroButtonProps) {
  const { getToken } = useAuth();
  const [videoOpen, setVideoOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequestVideo = async () => {
    setRequesting(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${apiBaseUrl}/api/admin/applications/${applicationId}/request-video`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setRequested(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  if (introVideoPath) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setVideoOpen(true)}
        >
          <Video className="size-3.5" />
          View Video
        </Button>

        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle>
                Video Introduction — {applicantName}
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              <div className="overflow-hidden rounded-lg bg-black">
                <video
                  src={introVideoPath}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      disabled={requesting || requested}
      onClick={handleRequestVideo}
    >
      {requesting ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Mail className="size-3.5" />
      )}
      {requested ? "Video Requested" : "Request Video"}
    </Button>
  );
}
