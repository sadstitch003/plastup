"use client";

import { useEffect, useMemo, useState } from "react";
const DEMO_SCALE_ID = "TBG-01";

export const scaleBarcodeCode = (scaleId: string, kg: number) =>
  `SCALE:${scaleId}:${Math.round(kg * 1000)}`;

function bars(value: string) {
  let seed = 0;
  for (const ch of value) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const out: number[] = [2, 1, 1, 1, 2, 1];
  for (let i = 0; i < 70; i += 1) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    out.push(1 + ((seed >>> 16) % 3));
  }
  return [...out, 1, 1, 2, 1, 1, 2];
}

function ScaleTicket({ code, kg, scaleId }: { code: string; kg: number; scaleId: string }) {
  const widths = useMemo(() => bars(code), [code]);
  let x = 0;
  const rects = widths.map((w, i) => {
    const rect = i % 2 === 0 ? <rect key={i} x={x} y={0} width={w} height={60} fill="#222" /> : null;
    x += w;
    return rect;
  });
  const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="scale-ticket">
      <div className="scale-ticket-head">
        <span>TIMBANGAN {scaleId}</span>
        <span>{time}</span>
      </div>
      <div className="scale-ticket-kg">{kg.toFixed(3)} kg</div>
      <svg viewBox={`0 0 ${x} 60`} preserveAspectRatio="none" className="scale-ticket-bars" aria-hidden>
        {rects}
      </svg>
      <div className="scale-ticket-code">{code}</div>
    </div>
  );
}

/** Demo kamera: struk timbangan + barcode, bukan QR customer. */
export function ScaleScanModal({
  bagLabel,
  kg,
  onClose,
  onUse,
}: {
  bagLabel: string;
  kg: number;
  onClose: () => void;
  onUse: () => void;
}) {
  const [found, setFound] = useState(false);
  const code = scaleBarcodeCode(DEMO_SCALE_ID, kg);

  useEffect(() => {
    const timer = window.setTimeout(() => setFound(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-label="Scan timbangan" onClick={onClose}>
      <div className="auth-modal scan-modal" onClick={(e) => e.stopPropagation()}>
        <p className="scale-scan-title">Scan barcode timbangan</p>
        <p className="scale-scan-sub">{bagLabel}</p>
        <div className="scan-modal-viewport scan-modal-viewport--scale">
          {found ? (
            <ScaleTicket code={code} kg={kg} scaleId={DEMO_SCALE_ID} />
          ) : (
            <p className="scan-modal-loading">Mencari barcode…</p>
          )}
          <span className="scan-corner scan-corner--tl" />
          <span className="scan-corner scan-corner--tr" />
          <span className="scan-corner scan-corner--bl" />
          <span className="scan-corner scan-corner--br" />
          {found && <span className="scale-scan-line" aria-hidden />}
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