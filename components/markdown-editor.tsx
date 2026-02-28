"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const [mode, setMode] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Button
          type="button"
          variant={mode === "write" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("write")}
        >
          Write
        </Button>
        <Button
          type="button"
          variant={mode === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("preview")}
        >
          Preview
        </Button>
      </div>

      {mode === "write" ? (
        <Textarea
          rows={12}
          placeholder="Write your description in markdown... Use ## for headings, - for bullet points, **bold**, etc."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="min-h-[288px] rounded-md border border-input bg-background px-3 py-2">
          {value ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
};

export { MarkdownEditor };
