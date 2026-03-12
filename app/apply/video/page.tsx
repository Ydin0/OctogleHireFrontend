"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Circle,
  Loader2,
  Mail,
  RotateCcw,
  Square,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Navbar } from "@/components/marketing/navbar";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Phase = "email" | "otp" | "record" | "uploading" | "done";
type RecordingState = "idle" | "previewing" | "recording" | "recorded";

const MAX_DURATION = 60;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoUploadPage() {
  const [phase, setPhase] = useState<Phase>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [uploadToken, setUploadToken] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Recording state
  const [recordState, setRecordState] = useState<RecordingState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  useEffect(() => {
    return () => {
      stopStream();
      clearTimer();
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [stopStream, clearTimer, recordedUrl]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/public/video-upload/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Failed to send verification code.");
      }

      setPhase("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/public/video-upload/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), code: otpCode.trim() }),
        },
      );

      const data = (await res.json()) as {
        ok?: boolean;
        uploadToken?: string;
        applicationId?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "Invalid or expired code.");
      }

      setUploadToken(data.uploadToken ?? null);
      setApplicationId(data.applicationId ?? null);
      setPhase("record");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Record video ──────────────────────────────────────────────────

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
      setRecordState("previewing");
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
      setRecordedBlob(blob);

      const url = URL.createObjectURL(blob);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(url);

      stopStream();
      setRecordState("recorded");
    };

    recorder.start(1000);
    setRecordState("recording");

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
    setRecordedBlob(null);
    setElapsed(0);
    setRecordState("idle");
    await startCamera();
  };

  // ── Step 4: Upload ────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!recordedBlob || !uploadToken) return;

    setPhase("uploading");
    setError(null);

    try {
      const ext = recordedBlob.type.includes("mp4") ? ".mp4" : ".webm";
      const file = new File([recordedBlob], `intro-video${ext}`, {
        type: recordedBlob.type,
      });

      const formData = new FormData();
      formData.append("uploadToken", uploadToken);
      formData.append("introVideo", file);

      const res = await fetch(`${apiBaseUrl}/api/public/video-upload/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Upload failed.");
      }

      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPhase("record");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />
      <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-lg">
            {/* ── Email step ─────────────────────────────────────────── */}
            {phase === "email" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <Camera className="size-6" />
                  </div>
                  <h2 className="text-lg font-semibold">Video Introduction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Record a 1-minute video introducing yourself and your top 3 career achievements.
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="video-email">
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="video-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the email you used for your application. We&apos;ll send a verification code.
                  </p>
                  <div className="min-h-5">
                    {error && <FieldError>{error}</FieldError>}
                  </div>
                </Field>

                <Button
                  className="w-full gap-2 rounded-full"
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim()}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                  Send Verification Code
                </Button>
              </div>
            )}

            {/* ── OTP step ───────────────────────────────────────────── */}
            {phase === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <Mail className="size-6" />
                  </div>
                  <h2 className="text-lg font-semibold">Check Your Email</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="otp-code">
                    Verification Code
                  </FieldLabel>
                  <Input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center font-mono text-2xl tracking-[0.3em]"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError(null);
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && otpCode.length === 6 && handleVerifyOtp()
                    }
                    disabled={loading}
                  />
                  <div className="min-h-5">
                    {error && <FieldError>{error}</FieldError>}
                  </div>
                </Field>

                <Button
                  className="w-full gap-2 rounded-full"
                  onClick={handleVerifyOtp}
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                  Verify
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => {
                      setPhase("email");
                      setOtpCode("");
                      setError(null);
                    }}
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            )}

            {/* ── Record step ────────────────────────────────────────── */}
            {phase === "record" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Record Your Video</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    1 minute max. Introduce yourself and share your top 3 career achievements.
                  </p>
                </div>

                {cameraError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm text-destructive">{cameraError}</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Camera preview / recording */}
                {(recordState === "previewing" || recordState === "recording") && (
                  <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="aspect-video w-full -scale-x-100 object-cover"
                    />
                    {recordState === "recording" && (
                      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                        <span className="size-2 animate-pulse rounded-full bg-red-500" />
                        <span className="font-mono text-xs text-white">
                          {formatTime(elapsed)} / {formatTime(MAX_DURATION)}
                        </span>
                      </div>
                    )}
                    {recordState === "recording" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          className="h-1 bg-red-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${(elapsed / MAX_DURATION) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Playback */}
                {recordState === "recorded" && recordedUrl && (
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

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  {recordState === "idle" && (
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

                  {recordState === "previewing" && (
                    <Button
                      type="button"
                      className="gap-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                      onClick={startRecording}
                    >
                      <Circle className="size-4 fill-current" />
                      Start Recording
                    </Button>
                  )}

                  {recordState === "recording" && (
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

                  {recordState === "recorded" && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 rounded-full"
                        onClick={reRecord}
                      >
                        <RotateCcw className="size-4" />
                        Re-record
                      </Button>
                      <Button
                        className="gap-2 rounded-full"
                        onClick={handleUpload}
                      >
                        <Upload className="size-4" />
                        Upload Video
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── Uploading step ──────────────────────────────────────── */}
            {phase === "uploading" && (
              <div className="space-y-6 text-center">
                <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
                <div>
                  <h2 className="text-lg font-semibold">Uploading...</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Please don&apos;t close this page.
                  </p>
                </div>
              </div>
            )}

            {/* ── Done step ───────────────────────────────────────────── */}
            {phase === "done" && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check className="size-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Video Uploaded</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thank you! Our team will review your video introduction as part of your application.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
