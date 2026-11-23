"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { depositPublicId } from "@/lib/deposit-codes";
import { depositBagLines, findStaffDepositById, listAllDeposits } from "@/lib/demo-deposit-store";
import { formatDateId, formatTimeId } from "@/lib/admin-format";

const STATUS_LABEL = {
  processing: "Diproses",
  completed: "Selesai",
} as const;

export default function StaffDepositDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(String(params.id ?? ""));
  const all = useMemo(() => listAllDeposits(), []);
  const deposit = findStaffDepositById(id);
  const code = deposit ? depositPublicId(deposit, all) : id;
  const bags = deposit ? depositBagLines(deposit, all) : [];

  if (!deposit || deposit.siteId !== DEMO_STAFF_SITE_ID) {
    return (
      <div>
        <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Detail setoran</h1>
        <p style={{ color: "var(--muted)" }}>Setoran tidak ditemukan.</p>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/admin/deposits">← Kembali ke daftar setoran</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Setoran {code}</h1>

      <div className="admin-stat-grid admin-stat-grid--2" style={{ marginBottom: 16 }}>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Pengguna</p>
          <p className="admin-stat-value">{deposit.customerName}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Total berat</p>
          <p className="admin-stat-value">{deposit.weightKg.toFixed(3)} kg</p>
        </div>
      </div>

      <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--muted)" }}>
        {formatDateId(deposit.createdAt)} · {formatTimeId(deposit.createdAt)} · {deposit.siteName} ·{" "}
        <strong style={{ color: deposit.status === "completed" ? "var(--green-dark)" : "var(--muted)" }}>
          {STATUS_LABEL[deposit.status]}
        </strong>
      </p>

      <h2 className="admin-section-title">Kantong</h2>
      <div className="admin-sheet">
        <div className="admin-table-wrap admin-table-wrap--inset">
          <table className="admin-table admin-table--fixed">
            <colgroup>
              <col className="admin-col--deposit-id" />
              <col className="admin-col--kg" />
            </colgroup>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Berat</th>
              </tr>
            </thead>
            <tbody>
              {bags.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ color: "var(--muted)" }}>
                    Tidak ada data kantong.
                  </td>
                </tr>
              )}
              {bags.map((bag) => (
                <tr key={bag.key}>
                  <td>{bag.label}</td>
                  <td>{bag.weightKg.toFixed(3)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--muted)" }}>
        Tunai Rp {deposit.cash.toLocaleString("id-ID")} · +{deposit.points.toLocaleString("id-ID")} poin
      </p>

      <p style={{ margin: "16px 0 0", fontSize: 14 }}>
        <Link href="/admin/deposits">← Kembali ke daftar setoran</Link>
      </p>
    </div>
  );
}