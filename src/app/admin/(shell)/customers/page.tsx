"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminPager, pageOf } from "@/components/admin/AdminPager";
import { DEMO_SITES } from "@/lib/demo-dashboard";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { customerDisplayName, customerTypeLabel } from "@/lib/demo-customers";
import {
  VERIFY_STATUS_LABEL,
  listAllStaffCustomers,
  siteNameForCustomer,
  type StaffCustomerRow,
} from "@/lib/demo-customer-store";

type VerifyFilter = "all" | StaffCustomerRow["verifyStatus"];
type SiteFilter = "all" | string;

export default function StaffCustomersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<StaffCustomerRow[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState<SiteFilter>(DEMO_STAFF_SITE_ID);
  const [statusFilter, setStatusFilter] = useState<VerifyFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = () => setRows(listAllStaffCustomers());
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((c) => {
      if (siteFilter !== "all" && String(c.homeSiteId) !== siteFilter) return false;
      if (statusFilter !== "all" && c.verifyStatus !== statusFilter) return false;
      if (!q) return true;
      const name = customerDisplayName(c).toLowerCase();
      return (
        name.includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        (c.nationalId && c.nationalId.includes(q))
      );
    });
  }, [rows, query, siteFilter, statusFilter]);

  const shown = pageOf(filtered, page);

  const runSearch = () => {
    setQuery(draft);
    setPage(1);
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Daftar pengguna</h1>

      <div className="admin-filters-stack">
        <div className="admin-filters admin-filters--search-row">
          <input
            className="admin-filters-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Cari nama atau HP"
            aria-label="Cari pengguna"
          />
          <button type="button" className="admin-filters-btn" onClick={runSearch}>
            Cari
          </button>
          <Link href="/admin/customers/new" className="admin-filters-btn admin-filters-btn--primary">
            Daftar pengguna baru
          </Link>
        </div>
        <div className="admin-filters admin-filters--filter-row">
          <select
            className="admin-filters-select admin-filters-select--grow"
            value={siteFilter}
            onChange={(e) => {
              setSiteFilter(e.target.value as SiteFilter);
              setPage(1);
            }}
            aria-label="TPS"
          >
            <option value="all">Semua TPS</option>
            {DEMO_SITES.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          <select
            className="admin-filters-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as VerifyFilter);
              setPage(1);
            }}
            aria-label="Status verifikasi"
          >
            <option value="all">Semua status</option>
            <option value="verified">Terverifikasi</option>
            <option value="none">Belum verifikasi</option>
          </select>
        </div>
      </div>

      <div className="admin-sheet">
        <div className="admin-table-wrap admin-table-wrap--inset">
          <table className="admin-table admin-table--fixed">
            <colgroup>
              <col className="admin-col--customer" />
              <col className="admin-col--date" />
              <col className="admin-col--customer" />
              <col className="admin-col--tps" />
              <col className="admin-col--customer" />
              <col className="admin-col--dispatch-status" />
            </colgroup>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nomor HP</th>
                <th>Alamat</th>
                <th>TPS</th>
                <th>Tipe</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)" }}>
                    Tidak ada pengguna.
                  </td>
                </tr>
              )}
              {shown.rows.map((c) => {
                const open = () => router.push(`/admin/customers/${encodeURIComponent(c.id)}`);
                return (
                  <tr
                    key={c.id}
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
                    <td>{customerDisplayName(c)}</td>
                    <td>{c.phone}</td>
                    <td>{c.address || "—"}</td>
                    <td>{siteNameForCustomer(c.homeSiteId)}</td>
                    <td>{customerTypeLabel(c.customerType)}</td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: c.verifyStatus === "verified" ? "var(--green-dark)" : "var(--muted)",
                      }}
                    >
                      {VERIFY_STATUS_LABEL[c.verifyStatus]}
                    </td>
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