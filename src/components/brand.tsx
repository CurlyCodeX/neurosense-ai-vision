import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-elegant)]">
          <Activity className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition" />
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-foreground">NeuroSense</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI · Epilepsy</span>
        </div>
      )}
    </Link>
  );
}