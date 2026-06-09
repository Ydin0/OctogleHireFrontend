// Server-safe scroll wrapper for standard (non-split-pane) console pages.
// The dashboard <main> is overflow-hidden, so each page owns its own scroll.
export function ConsoleScroll({
  children,
  max = 1180,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-background">
      <div className="mx-auto space-y-6 px-8 pb-14 pt-7" style={{ maxWidth: max }}>
        {children}
      </div>
    </div>
  );
}
