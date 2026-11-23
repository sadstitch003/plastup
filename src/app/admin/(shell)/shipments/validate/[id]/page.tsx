"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { formatDateId, formatTimeId } from "@/lib/admin-format";
import { getShipmentById, recordReceivedWeight, shipmentBagLines } from "@/lib/demo-shipment-store";

export default function StaffValidateWeightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(String(params.id ?? ""));
  const shipment = useMemo(() => getShipmentById(id), [id]);
  const bags = useMemo(() => (shipment ? shipmentBagLines(shipment) : []), [shipment]);

  const [receivedText, setReceivedText] = useState("");
  const [error, setError] = useState("");

  if (!shipment || shipment.siteId !== DEMO_STAFF_SITE_ID) {
    return (
      <div>
        <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Validasi berat</h1>
        <p style={{ color: "var(--muted)" }}>Kiriman tidak ditemukan.</p>
      </div>
    );
  }

  const alreadyDone = shipment.receivedKg != null;

  const save = () => {
    setError("");
    const kg = Number(receivedText.replace(",", "."));
    if (!(kg > 0)) {
      setError("Masukkan total berat terima yang valid (kg).");
      return;
    }
    const updated = recordReceivedWeight(id, kg);
    if (!updated) {
      setError("Gagal menyimpan. Kiriman mungkin sudah divalidasi.");
      return;
    }
    router.push("/admin/shipments");
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Validasi berat</h1>

      <div className="admin-stat-grid admin-stat-grid--2" style={{ marginBottom: 16, maxWidth: 320, gridTemplateColumns: "1fr" }}>
        <div className="admin-stat-card">
          <p className="admin-stat-label">Kode kiriman</p>
          <p className="admin-stat-value">{shipment.id}</p>
        </div>
      </div>

      <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted)" }}>
        {shipment.siteName}
        {shipment.createdAt ? (
          <>
            {" "}
            · {formatDateId(shipment.createdAt)} {formatTimeId(shipment.createdAt)}
          </>
        ) : null}
      </p>

      <div className="dispatch-bag-panel">
        <span className="admin-section-title" style={{ margin: "0 0 10px", display: "block" }}>
          Kantong dalam kiriman
        </span>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--muted)" }}>
          {bags.length} kantong
        </p>
        <ul className="validation-bag-code-list" aria-label="Daftar kode kantong">
          {bags.map((bag, index) => (
            <li key={bag.key} className="validation-bag-code-item">
              <span className="validation-bag-code-no">{index + 1}</span>
              <span className="validation-bag-code">{bag.label}</span>
            </li>
          ))}
        </ul>

        {alreadyDone ? (
          <p style={{ margin: "16px 0 0", fontWeight: 700, color: "var(--green-dark)" }}>
            Total berat terima: {shipment.receivedKg!.toFixed(3)} kg (sudah tersimpan)
          </p>
        ) : (
          <>
            <div className="auth-field" style={{ marginTop: 16 }}>
              <label htmlFor="received-kg-total">Total berat terima (kg)</label>
              <input
                id="received-kg-total"
                type="text"
                inputMode="decimal"
                className="admin-field-input"
                value={receivedText}
                onChange={(e) => {
                  setReceivedText(e.target.value);
                  setError("");
                }}
                placeholder="Contoh: 12.300"
                autoComplete="off"
              />
            </div>
            {error ? <p className="auth-error">{error}</p> : null}
            <button
              type="button"
              className="auth-btn-primary pengumpulan-btn"
              style={{ width: "100%", marginTop: 14 }}
              onClick={save}
            >
              Simpan validasi
            </button>
          </>
        )}
      </div>
    </div>
  );
}