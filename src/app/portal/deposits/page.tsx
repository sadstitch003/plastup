"use client";

import { useMemo } from "react";
import { PortalCard } from "@/components/PortalCard";
import { formatDateId } from "@/lib/admin-format";
import { listCustomerDepositHistory, type CustomerDepositHistoryRow } from "@/lib/demo-customer-deposits";
import { loadCustomerProfile } from "@/lib/demo-profile";

export default function CustomerDepositsPage() {
  const me = loadCustomerProfile();
  const rows = useMemo(() => listCustomerDepositHistory(me), [me]);

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Riwayat setoran</h1>

      {rows.length === 0 ? (
        <PortalCard>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 15 }}>Belum ada riwayat setoran.</p>
        </PortalCard>
      ) : (
        <ul className="deposit-history-list">
          {rows.map((row) => (
            <li key={row.id}>
              <DepositHistoryRow row={row} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DepositHistoryRow({ row }: { row: CustomerDepositHistoryRow }) {
  return (
    <article className="portal-card deposit-history-row">
      <div className="deposit-history-row__main">
        <p className="deposit-history-row__date">{formatDateId(row.date)}</p>
        <p className="deposit-history-row__site">{row.siteName}</p>
        <p className="deposit-history-row__weight">{row.weightKg.toFixed(1)} kg</p>
      </div>
      <div className="deposit-history-row__rewards">
        <span className="deposit-history-row__cash">Rp {row.cash.toLocaleString("id-ID")}</span>
        <span className="deposit-history-row__points">+{row.points.toLocaleString("id-ID")} poin</span>
      </div>
    </article>
  );
}
