import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownDisplayProps {
  content: string;
}

const MarkdownDisplay = ({ content }: MarkdownDisplayProps) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export { MarkdownDisplay };
