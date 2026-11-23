"use client";

import { useEffect, useState } from "react";
import { DirtyCamera } from "@/components/DirtyCamera";

/** Demo kamera: QR tampak seperti foto, lalu Gunakan memanggil onUse. */
export function ScanModal({ value, onClose, onUse }: { value: string; onClose: () => void; onUse: () => void }) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setFound(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-label="Kamera" onClick={onClose}>
      <div className="auth-modal scan-modal" onClick={(e) => e.stopPropagation()}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, textAlign: "center" }}>Kamera</p>
        <div className="scan-modal-viewport">
          {found ? (
            <DirtyCamera value={value} />
          ) : (
            <p className="scan-modal-loading">Mencari kode…</p>
          )}
          <span className="scan-corner scan-corner--tl" />
          <span className="scan-corner scan-corner--tr" />
          <span className="scan-corner scan-corner--bl" />
          <span className="scan-corner scan-corner--br" />
        </div>
        <div className="scan-modal-actions">
          <button type="button" className="staff-btn-outline" onClick={onClose}>
            Tutup
          </button>
          <button type="button" className="auth-btn-primary scan-modal-use" disabled={!found} onClick={onUse}>
            Gunakan
          </button>
        </div>
      </div>
    </div>
  );
}