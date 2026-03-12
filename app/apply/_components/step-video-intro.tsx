"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Camera, Circle, RotateCcw, Square, Check } from "lucide-react";

import type { Application } from "@/lib/schemas/application";
import { Button } from "@/components/ui/button";

type RecordingState = "idle" | "previewing" | "recording" | "recorded";

const MAX_DURATION = 60;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const StepVideoIntro = () => {
  const { setValue, watch } = useFormContext<Application>();
  const existingVideo = watch("introVideo");

  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<RecordingState>(
    existingVideo ? "recorded" : "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      clearTimer();
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [stopStream, clearTimer, recordedUrl]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("previewing");
    } catch {
      setCameraError(
        "Unable to access camera or microphone. Please check your browser permissions.",
      );
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    setElapsed(0);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType.split(";")[0] });
      const ext = mimeType.includes("mp4") ? ".mp4" : ".webm";
      const file = new File([blob], `intro-video${ext}`, {
        type: blob.type,
      });
      setValue("introVideo", file, { shouldValidate: true });

      const url = URL.createObjectURL(blob);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(url);

      stopStream();
      setState("recorded");
    };

    recorder.start(1000);
    setState("recording");

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= MAX_DURATION) {
          stopRecording();
        }
        return next;
      });
    }, 1000);
  };

  const stopRecording = () => {
    clearTimer();
    recorderRef.current?.stop();
  };

  const reRecord = async () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setElapsed(0);
    setState("idle");
    await startCamera();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold">What to cover</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> Briefly introduce yourself
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> Share your top 3 career achievements
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> Why you&apos;re looking for new opportunities
          </li>
        </ul>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          Maximum 1 minute &middot; Camera + microphone required
        </p>
      </div>

      {cameraError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-sm text-destructive">{cameraError}</p>
        </div>
      )}

      {/* Camera preview / recording */}
      {(state === "previewing" || state === "recording") && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="aspect-video w-full -scale-x-100 object-cover"
          />

          {/* Recording indicator */}
          {state === "recording" && (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              <span className="size-2 animate-pulse rounded-full bg-red-500" />
              <span className="font-mono text-xs text-white">
                {formatTime(elapsed)} / {formatTime(MAX_DURATION)}
              </span>
            </div>
          )}

          {/* Time remaining bar */}
          {state === "recording" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-1 bg-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(elapsed / MAX_DURATION) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Playback of recorded video */}
      {state === "recorded" && recordedUrl && (
        <div className="relative overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={playbackRef}
            src={recordedUrl}
            controls
            playsInline
            className="aspect-video w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 backdrop-blur-sm">
            <Check className="size-3 text-white" />
            <span className="text-xs font-medium text-white">Recorded</span>
          </div>
        </div>
      )}

      {/* Recorded but no URL (existing file from form state) */}
      {state === "recorded" && !recordedUrl && existingVideo && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <Check className="size-4 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Video recorded</p>
            <p className="text-xs text-muted-foreground">
              {existingVideo.name} &middot;{" "}
              {(existingVideo.size / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {state === "idle" && (
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-full"
            onClick={startCamera}
          >
            <Camera className="size-4" />
            Open Camera
          </Button>
        )}

        {state === "previewing" && (
          <Button
            type="button"
            className="gap-2 rounded-full bg-red-600 text-white hover:bg-red-700"
            onClick={startRecording}
          >
            <Circle className="size-4 fill-current" />
            Start Recording
          </Button>
        )}

        {state === "recording" && (
          <Button
            type="button"
            variant="destructive"
            className="gap-2 rounded-full"
            onClick={stopRecording}
          >
            <Square className="size-3.5 fill-current" />
            Stop Recording
          </Button>
        )}

        {state === "recorded" && (
          <Button
            type="button"
            variant="outline"
            className="gap-2 rounded-full"
            onClick={reRecord}
          >
            <RotateCcw className="size-4" />
            Re-record
          </Button>
        )}
      </div>
    </div>
  );
};

export { StepVideoIntro };
