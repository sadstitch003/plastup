"use client";

import { PointsBalanceCard } from "@/components/PointsBalanceCard";
import { PortalCard } from "@/components/PortalCard";
import { DEMO_REWARD_CATALOG } from "@/lib/demo-rewards";
import { loadCustomerProfile } from "@/lib/demo-profile";

export default function CustomerRewardsPage() {
  const me = loadCustomerProfile();

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Penukaran poin</h1>

      <PointsBalanceCard points={me.points} />

      <PortalCard title="Bisa ditukar">
        <ul className="reward-catalog-list">
          {DEMO_REWARD_CATALOG.map((item) => {
            const enough = me.points >= item.points;
            return (
              <li key={item.id} className={`reward-catalog-item${enough ? "" : " reward-catalog-item--locked"}`}>
                <div className="reward-catalog-item__copy">
                  <p className="reward-catalog-item__name">{item.name}</p>
                  {item.detail ? <p className="reward-catalog-item__detail">{item.detail}</p> : null}
                </div>
                <p className="reward-catalog-item__points">{item.points.toLocaleString("id-ID")} poin</p>
              </li>
            );
          })}
        </ul>
        <p className="reward-catalog-hint">Tunjukkan Kode Saya di loket TPS untuk menukar hadiah.</p>
      </PortalCard>
    </div>
  );
}
