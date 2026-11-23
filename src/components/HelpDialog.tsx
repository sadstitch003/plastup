"use client";

import { useEffect, useState } from "react";

const FAQ_ITEMS = [
  { question: "Bagaimana cara setor?", answer: "Tunjukkan Kode Saya di Beranda. Petugas scan, timbang karung, poin masuk otomatis." },
  { question: "Poin belum bertambah?", answer: "Cek Riwayat setoran. Jika belum muncul, hubungi petugas TPS." },
  { question: "Cara cairkan?", answer: "Lengkapi KTP di Akun → tunggu verifikasi admin → Cairkan jika saldo sudah minimum." },
  { question: "Lupa password?", answer: "Hubungi petugas TPS / admin." },
];

const ADMIN_CHAT =
  "https://wa.me/6285168614110?text=Halo%20admin%20TPS%2C%20saya%20butuh%20bantuan.";

export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [openQ, setOpenQ] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setOpenQ(null);
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const items = FAQ_ITEMS.filter(
    (item) => !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
  );

  return (
    <div className="help-dialog-backdrop" role="dialog" aria-modal="true" aria-label="Bantuan" onClick={onClose}>
      <div className="help-dialog-panel" onClick={(e) => e.stopPropagation()}>
        <div className="help-dialog-header">
          <h2>Bantuan</h2>
          <button type="button" className="help-dialog-close" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </div>
        <div className="help-dialog-search">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenQ(null);
            }}
            placeholder="Cari pertanyaan"
            aria-label="Cari pertanyaan"
            className="admin-field-input"
          />
        </div>
        <div className="help-dialog-list">
          {items.length === 0 && <p className="help-dialog-empty">Tidak ada pertanyaan yang cocok.</p>}
          {items.map((item) => {
            const expanded = openQ === item.question;
            return (
              <div key={item.question} className="help-faq-item">
                <button
                  type="button"
                  className="help-faq-q"
                  aria-expanded={expanded}
                  onClick={() => setOpenQ(expanded ? null : item.question)}
                >
                  <span>{item.question}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    aria-hidden
                    className={expanded ? "help-faq-chevron help-faq-chevron--open" : "help-faq-chevron"}
                  >
                    <path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                {expanded && <p className="help-faq-a">{item.answer}</p>}
              </div>
            );
          })}
        </div>
        <div className="help-dialog-footer">
          <a className="help-dialog-wa" href={ADMIN_CHAT} target="_blank" rel="noreferrer">
            Chat dengan admin
          </a>
        </div>
      </div>
    </div>
  );
}