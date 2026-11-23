"use client";

import { useEffect, useState } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { formatDateId, formatTimeId } from "@/lib/admin-format";
import { listStaffShipments, validationStatusLabel, type ShipmentRow } from "@/lib/demo-shipment-store";

function formatKg(n: number) {
  return n.toFixed(3);
}

export default function StaffValidationHistoryPage() {
  const [rows, setRows] = useState<ShipmentRow[]>([]);

  useEffect(() => {
    const load = () => setRows(listStaffShipments(DEMO_STAFF_SITE_ID));
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Daftar validasi berat</h1>
      <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
        Bandingkan berat deklarasi TPS dengan hasil timbang Terminal Tangkel. Selisih untuk tinjauan admin.
      </p>

      <div className="admin-sheet">
        <div className="admin-table-wrap admin-table-wrap--inset">
          <table className="admin-table admin-table--fixed admin-table--validation-weights">
            <colgroup>
              <col className="admin-col--deposit-id" />
              <col className="admin-col--date" />
              <col className="admin-col--time" />
              <col className="admin-col--kg-input" />
              <col className="admin-col--kg-input" />
              <col className="admin-col--kg" />
              <col className="admin-col--dispatch-status" />
            </colgroup>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Deklarasi (kg)</th>
                <th>Terima (kg)</th>
                <th>Selisih (kg)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "var(--muted)" }}>
                    Belum ada data validasi.
                  </td>
                </tr>
              )}
              {rows.map((row) => {
                const done = row.receivedKg != null;
                const delta = done ? row.receivedKg! - row.declaredKg : null;
                const deltaTone =
                  delta == null
                    ? "var(--muted)"
                    : Math.abs(delta) < 0.001
                      ? "var(--green-dark)"
                      : delta < 0
                        ? "#c62828"
                        : "var(--green-dark)";
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.createdAt ? formatDateId(row.createdAt) : "—"}</td>
                    <td>{row.createdAt ? formatTimeId(row.createdAt) : "—"}</td>
                    <td>
                      <input
                        type="text"
                        readOnly
                        className="admin-table-kg-input"
                        value={formatKg(row.declaredKg)}
                        aria-label={`Deklarasi ${row.id}`}
                        tabIndex={-1}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        readOnly
                        className="admin-table-kg-input"
                        value={done ? formatKg(row.receivedKg!) : ""}
                        placeholder={done ? undefined : "—"}
                        aria-label={`Terima ${row.id}`}
                        tabIndex={-1}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        readOnly
                        className="admin-table-kg-input admin-table-kg-input--delta"
                        value={
                          delta == null
                            ? ""
                            : `${delta > 0 ? "+" : ""}${formatKg(delta)}`
                        }
                        placeholder={done ? undefined : "—"}
                        style={{ color: deltaTone, fontWeight: 700 }}
                        aria-label={`Selisih ${row.id}`}
                        tabIndex={-1}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        color: done ? "var(--green-dark)" : "var(--muted)",
                      }}
                    >
                      {validationStatusLabel(row)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}