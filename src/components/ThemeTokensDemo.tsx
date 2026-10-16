export function ThemeTokensDemo() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-3">
        <div className="h-10 w-24 rounded bg-apple-red text-center text-xs font-bold leading-10 text-white shadow-artwork">
          #FA233B Light
        </div>
        <div className="h-10 w-24 rounded bg-apple-red-dark text-center text-xs font-bold leading-10 text-white shadow-artwork">
          #FA2D48 Dark
        </div>
      </div>
      <div className="rounded-lg border border-apple-border bg-apple-sidebar p-3 backdrop-blur-xl">
        <div className="text-sm font-semibold text-apple-text">Sidebar Token</div>
        <div className="text-xs text-apple-text-muted">Muted Subtitle Text</div>
        <div className="text-[10px] text-apple-text-subtle">Subtle Secondary Text</div>
      </div>
      <div className="rounded-lg border border-apple-lcd-border bg-apple-lcd p-3 shadow-lcd backdrop-blur-md">
        <div className="text-xs font-medium text-apple-text">LCD Capsule Background</div>
      </div>
    </div>
  );
}
