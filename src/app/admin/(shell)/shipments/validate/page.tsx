"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { formatDateId, formatTimeId } from "@/lib/admin-format";
import {
  listPendingValidation,
  prepareValidationDemoList,
  shipmentBagLines,
  type ShipmentRow,
} from "@/lib/demo-shipment-store";

export default function StaffValidateWeightListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ShipmentRow[]>([]);

  useEffect(() => {
    prepareValidationDemoList();
    setRows(listPendingValidation(DEMO_STAFF_SITE_ID));
    const onFocus = () => {
      prepareValidationDemoList();
      setRows(listPendingValidation(DEMO_STAFF_SITE_ID));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Validasi berat</h1>
      <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
        Pilih kiriman, lalu isi total berat terima di TPA.
      </p>

      <div className="admin-sheet">
        <div className="admin-table-wrap admin-table-wrap--inset">
          <table className="admin-table admin-table--fixed admin-table--dispatch-history">
            <colgroup>
              <col className="admin-col--deposit-id" />
              <col className="admin-col--date" />
              <col className="admin-col--time" />
              <col className="admin-col--bags" />
            </colgroup>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Kantong</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: "var(--muted)" }}>
                    Tidak ada kiriman menunggu validasi. Setorkan sampah dari TPS terlebih dahulu.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="click"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/shipments/validate/${encodeURIComponent(row.id)}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/admin/shipments/validate/${encodeURIComponent(row.id)}`);
                    }
                  }}
                >
                  <td>{row.id}</td>
                  <td>{row.createdAt ? formatDateId(row.createdAt) : "—"}</td>
                  <td>{row.createdAt ? formatTimeId(row.createdAt) : "—"}</td>
                  <td>{shipmentBagLines(row).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}