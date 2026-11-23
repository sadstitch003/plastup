"use client";

export function LegalModal({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{body}</p>
        <button type="button" className="auth-btn-primary" style={{ marginTop: 16 }} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}