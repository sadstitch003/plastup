"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { listDispatchableBags } from "@/lib/demo-deposit-store";
import { staffDemoSite } from "@/lib/staff-site";
import { formatDateId, formatTimeId } from "@/lib/admin-format";
import {
  createDispatch,
  listSentBagKeys,
  listStaffShipments,
  markBagsSent,
  resetDispatchDemoSession,
  shipmentArrivalLabel,
  type ShipmentRow,
} from "@/lib/demo-shipment-store";

export default function StaffDispatchPage() {
  const staffSite = staffDemoSite();
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [sentKeys, setSentKeys] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => {
    setShipments(listStaffShipments(DEMO_STAFF_SITE_ID));
    setSentKeys(listSentBagKeys());
    setTick((n) => n + 1);
  }, []);

  useEffect(() => {
    resetDispatchDemoSession();
    reload();
  }, [reload]);

  const bagRows = useMemo(
  () => listDispatchableBags(DEMO_STAFF_SITE_ID, sentKeys),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sentKeys, tick],
  );

  useEffect(() => {
    setSelected(new Set(bagRows.map((b) => b.key)));
  }, [bagRows]);

  const selectedKg = useMemo(
    () => bagRows.filter((b) => selected.has(b.key)).reduce((sum, b) => sum + b.weightKg, 0),
    [bagRows, selected],
  );

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(bagRows.map((b) => b.key)) : new Set());
  };

  const submit = () => {
    const keys = bagRows.filter((b) => selected.has(b.key)).map((b) => b.key);
    if (!keys.length) {
      setMessage("Centang minimal satu kantong untuk disetorkan.");
      return;
    }
    if (!(selectedKg > 0)) {
      setMessage("Berat kantong terpilih tidak valid.");
      return;
    }
    const snapshot = bagRows
      .filter((b) => selected.has(b.key))
      .map((b) => ({
        key: b.key,
        label: b.label,
        depositId: b.depositId,
        customerName: b.customerName,
        weightKg: b.weightKg,
      }));
    createDispatch(DEMO_STAFF_SITE_ID, staffSite.name, selectedKg, snapshot);
    markBagsSent(keys);
    reload();
    setMessage(`Setoran sampah · ${selectedKg.toFixed(3)} kg (${keys.length} kantong) menuju Terminal Tangkel.`);
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Setorkan sampah ke Terminal Tangkel</h1>

      <div className="admin-stat-grid admin-stat-grid--2" style={{ marginBottom: 16 }}>
        <div className="admin-stat-card">
          <p className="admin-stat-label">TPS</p>
          <p className="admin-stat-value">{staffSite.name}</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Terpilih</p>
          <p className="admin-stat-value">
            {selected.size}/{bagRows.length} · {selectedKg.toFixed(3)} kg
          </p>
        </div>
      </div>

      <div className="dispatch-bag-panel">
        <div className="dispatch-bag-panel-head">
          <span className="admin-section-title" style={{ margin: 0 }}>
            Daftar kantong
          </span>
          <label className="dispatch-bag-select-all">
            <input
              type="checkbox"
              checked={bagRows.length > 0 && selected.size === bagRows.length}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            Pilih semua
          </label>
        </div>

        {bagRows.length === 0 ? (
          <p className="reward-summary-muted" style={{ margin: "12px 0" }}>
            Tidak ada kantong menunggu kirim.
          </p>
        ) : (
          <ul className="dispatch-bag-list">
            {bagRows.map((row) => (
              <li key={row.key}>
                <label className="dispatch-bag-row">
                  <input type="checkbox" checked={selected.has(row.key)} onChange={() => toggle(row.key)} />
                  <span className="dispatch-bag-row-label">{row.label}</span>
                  <span className="dispatch-bag-row-meta" title="Pengguna">
                    {row.customerName}
                  </span>
                  <span className="dispatch-bag-row-meta">{row.depositId}</span>
                  <span className="dispatch-bag-row-kg">{row.weightKg.toFixed(3)} kg</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && (
        <p style={{ margin: "12px 0", fontSize: 14, color: "var(--green-dark)", fontWeight: 600 }}>{message}</p>
      )}

      <button
        type="button"
        className="auth-btn-primary pengumpulan-btn"
        onClick={submit}
        disabled={bagRows.length === 0}
        style={{ width: "100%", maxWidth: 360, marginTop: 8 }}
      >
        Setorkan sampah
      </button>

      <h2 className="admin-section-title" style={{ marginTop: 28 }}>
        Daftar pengiriman
      </h2>
      <div className="admin-sheet" style={{ marginTop: 0 }}>
        <div className="admin-table-wrap admin-table-wrap--inset">
        <table className="admin-table admin-table--fixed admin-table--dispatch-history">
          <colgroup>
            <col className="admin-col--deposit-id" />
            <col className="admin-col--date" />
            <col className="admin-col--time" />
            <col className="admin-col--kg" />
            <col className="admin-col--dispatch-status" />
          </colgroup>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Tanggal pengiriman</th>
              <th>Jam</th>
              <th>Berat (kg)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: "var(--muted)" }}>
                  Belum ada pengiriman.
                </td>
              </tr>
            )}
            {shipments.map((row) => {
              const arrived = row.status === "arrived";
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.createdAt ? formatDateId(row.createdAt) : "—"}</td>
                  <td>{row.createdAt ? formatTimeId(row.createdAt) : "—"}</td>
                  <td>{row.declaredKg.toFixed(3)}</td>
                  <td
                    style={{
                      fontWeight: 700,
                      color: arrived ? "var(--green-dark)" : "var(--muted)",
                    }}
                  >
                    {shipmentArrivalLabel(row.status)}
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