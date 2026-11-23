import type { ReactNode } from "react";

export function PortalCard({
  children,
  title,
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  const cn = className ? `portal-card ${className}` : "portal-card";
  return (
    <div className={cn}>
      {title ? <h2 className="portal-card-title">{title}</h2> : null}
      {children}
    </div>
  );
}

export function PlaceholderPage({ title, detail }: { title: string; detail: string }) {
  return (
    <PortalCard title={title}>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 15, lineHeight: 1.5 }}>{detail}</p>
    </PortalCard>
  );
}