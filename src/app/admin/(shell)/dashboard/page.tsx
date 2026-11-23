"use client";

import { useMemo, useState } from "react";
import { RangeFilter } from "@/components/admin/RangeFilter";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { inRange, todayIso } from "@/lib/admin-format";
import { DEMO_DEPOSITS, totalKg } from "@/lib/demo-dashboard";
import { staffDemoSite } from "@/lib/staff-site";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value">{value}</p>
    </div>
  );
}

export default function StaffDashboardPage() {
  const staffSite = staffDemoSite();
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());

  const scoped = useMemo(
    () => DEMO_DEPOSITS.filter((d) => d.siteId === DEMO_STAFF_SITE_ID),
    [],
  );
  const ranged = useMemo(() => scoped.filter((d) => inRange(d.date, from, to)), [scoped, from, to]);
  const kg = ranged.reduce((sum, d) => sum + totalKg(d), 0);
  const kantong = ranged.reduce((sum, d) => sum + d.bags.length, 0);

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Dashboard</h1>

      <RangeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} lockedSite={staffSite} />

      <div className="admin-stat-grid">
        <StatCard label="Total setoran" value={String(ranged.length)} />
        <StatCard label="Total kantong" value={String(kantong)} />
        <StatCard label="Total berat" value={`${kg.toFixed(1)} kg`} />
      </div>

      <h2 className="admin-section-title">TPS Anda</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>TPS</th>
              <th>Setoran</th>
              <th>Berat</th>
              <th>Diproses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{staffSite.name}</td>
              <td>{ranged.length}</td>
              <td>{kg.toFixed(1)} kg</td>
              <td>{ranged.filter((d) => d.status === "processing").length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}