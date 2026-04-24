import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}

export function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl shadow-sm border border-border/30 p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  return (
    <SurfaceCard className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-card-foreground/60 font-medium">
          {label}
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        {delta && (
          <div className="mt-1 text-xs text-emerald-600 font-medium">{delta}</div>
        )}
      </div>
      {icon && (
        <div className="h-9 w-9 rounded-lg bg-accent/15 text-card-foreground grid place-items-center">
          {icon}
        </div>
      )}
    </SurfaceCard>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-card p-10 text-center flex flex-col items-center gap-3">
      {icon && (
        <div className="h-12 w-12 rounded-full bg-accent/15 grid place-items-center text-card-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-card-foreground/70 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-foreground/70 mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
