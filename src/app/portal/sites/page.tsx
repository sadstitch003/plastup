"use client";

import { PortalCard } from "@/components/PortalCard";
import { getTpsSites } from "@/lib/tps";

export default function CustomerSitesPage() {
  const sites = getTpsSites();

  return (
    <PortalCard title="TPS terdekat">
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>
        {sites.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--muted)" }}>Peta interaktif akan ditambahkan kemudian.</p>
    </PortalCard>
  );
}