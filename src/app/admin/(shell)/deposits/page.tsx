"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminPager, pageOf } from "@/components/admin/AdminPager";
import { RangeFilter } from "@/components/admin/RangeFilter";
import { formatDateId, formatTimeId, inRange, todayIso } from "@/lib/admin-format";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { depositPublicId } from "@/lib/deposit-codes";
import { listAllDeposits, type DepositListRow } from "@/lib/demo-deposit-store";
import { staffDemoSite } from "@/lib/staff-site";

export default function StaffDepositsListPage() {
  const router = useRouter();
  const staffSite = staffDemoSite();
  const [rows, setRows] = useState<DepositListRow[]>([]);
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setRows(listAllDeposits()), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((d) => {
      if (d.siteId !== DEMO_STAFF_SITE_ID) return false;
      const day = d.createdAt.slice(0, 10);
      if (!inRange(day, from, to)) return false;
      if (!q) return true;
      return (
        d.customerName.toLowerCase().includes(q) ||
        d.customerPhone.includes(q) ||
        d.siteName.toLowerCase().includes(q) ||
        depositPublicId(d, rows).toLowerCase().includes(q)
      );
    });
  }, [rows, from, to, query]);

  const shown = pageOf(filtered, page);

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Daftar setoran</h1>

      <div className="admin-filters">
        <input
          className="admin-filters-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (setQuery(draft), setPage(1))}
          placeholder="Cari nama atau ID"
          aria-label="Cari setoran"
        />
        <button
          type="button"
          className="admin-filters-btn"
          onClick={() => {
            setQuery(draft);
            setPage(1);
          }}
        >
          Cari
        </button>
        <Link href="/admin/deposits/new" className="admin-filters-btn admin-filters-btn--primary">
          Pengumpulan baru
        </Link>
      </div>

      <RangeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} lockedSite={staffSite} />

      <div className="admin-sheet">
        <div className="admin-table-wrap admin-table-wrap--inset">
          <table className="admin-table admin-table--fixed">
            <colgroup>
              <col className="admin-col--deposit-id" />
              <col className="admin-col--date" />
              <col className="admin-col--time" />
              <col className="admin-col--customer" />
              <col className="admin-col--tps" />
              <col className="admin-col--bags" />
              <col className="admin-col--kg" />
              <col className="admin-col--cash" />
              <col className="admin-col--points" />
            </colgroup>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Pengguna</th>
                <th>TPS</th>
                <th>Kantong</th>
                <th>Berat</th>
                <th>Tunai</th>
                <th>Poin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ color: "var(--muted)" }}>
                    Tidak ada setoran.
                  </td>
                </tr>
              )}
              {shown.rows.map((d) => {
                const depositId = depositPublicId(d, rows);
                const open = () => router.push(`/admin/deposits/${encodeURIComponent(depositId)}`);
                return (
                <tr
                  key={d.id}
                  className="click"
                  tabIndex={0}
                  onClick={open}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open();
                    }
                  }}
                >
                  <td>{depositId}</td>
                  <td>{formatDateId(d.createdAt)}</td>
                  <td>{formatTimeId(d.createdAt)}</td>
                  <td>{d.customerName}</td>
                  <td>{d.siteName}</td>
                  <td>{d.bagCount}</td>
                  <td>{d.weightKg.toFixed(3)} kg</td>
                  <td>Rp {d.cash.toLocaleString("id-ID")}</td>
                  <td>+{d.points.toLocaleString("id-ID")}</td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        <AdminPager page={shown.current} pages={shown.pages} onPage={setPage} />
      </div>
    </div>
  );
}