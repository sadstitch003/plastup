"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrModal({ open, phone, onClose }: { open: boolean; phone: string; onClose: () => void }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!open) return;
    void QRCode.toDataURL(`TPSUSER:${phone}`, { width: 240, margin: 1 }).then(setQr);
  }, [open, phone]);

  if (!open) return null;

  return (
    <div className="qr-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <h3 id="qr-modal-title">Kode Saya</h3>
        <div className="qr-modal-body">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="" width={220} height={220} className="qr-modal-img" />
          ) : (
            <p className="qr-modal-loading">Memuat kode…</p>
          )}
        </div>
        <button type="button" className="auth-btn-primary qr-modal-close" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}