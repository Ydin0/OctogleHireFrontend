"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  accept: string;
  maxSize: number;
  label: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const FileUpload = ({
  accept,
  maxSize,
  label,
  value,
  onChange,
  error,
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const isImage = accept.startsWith("image/") || accept.includes("image/");

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        setPreview(null);
        return;
      }

      onChange(file);

      if (isImage && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    },
    [onChange, isImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      handleFile(file);
    },
    [handleFile],
  );

  const remove = useCallback(() => {
    handleFile(null);
  }, [handleFile]);

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="size-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-md bg-muted">
            <FileText className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{value.name}</p>
          <p className="text-xs text-muted-foreground">
            {(value.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={remove}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-4 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
          dragOver && "border-primary bg-primary/5",
          error && "border-destructive",
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          {isImage ? (
            <ImageIcon className="size-5 text-muted-foreground" />
          ) : (
            <Upload className="size-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            Max {maxSize}MB
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </label>
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export { FileUpload };
