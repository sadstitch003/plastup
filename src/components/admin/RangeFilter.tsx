"use client";

import type { DemoSite } from "@/lib/demo-dashboard";

export function RangeFilter({
  from,
  to,
  onFrom,
  onTo,
  sites,
  siteId,
  onSite,
  lockedSite,
  siteLabel = "TPS",
}: {
  from: string;
  to: string;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  sites?: DemoSite[];
  siteId?: string;
  onSite?: (value: string) => void;
  /** Petugas TPS: tampilkan satu lokasi saja, tanpa dropdown. */
  lockedSite?: DemoSite;
  siteLabel?: string;
}) {
  return (
    <div className="admin-range">
      {lockedSite ? (
        <label>
          {siteLabel}
          <input
            type="text"
            readOnly
            value={lockedSite.name}
            aria-label={siteLabel}
            className="admin-range-locked"
          />
        </label>
      ) : (
        sites &&
        onSite && (
          <label>
            {siteLabel}
            <select value={siteId} onChange={(e) => onSite(e.target.value)} aria-label={siteLabel}>
              <option value="all">Semua TPS</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
        )
      )}
      <label>
        Dari
        <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} />
      </label>
      <label>
        Sampai
        <input type="date" value={to} onChange={(e) => onTo(e.target.value)} />
      </label>
    </div>
  );
}