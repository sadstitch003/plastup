"use client";

import { useState } from "react";
import { HelpDialog } from "@/components/HelpDialog";
import { IconHelp, IconHistory, IconQr, IconRedeem } from "@/components/nav-icons";
import { MenuTile } from "@/components/MenuTile";
import { PointsBalanceCard } from "@/components/PointsBalanceCard";
import { PortalCard } from "@/components/PortalCard";
import { QrModal } from "@/components/QrModal";
import { customerDisplayName, loadCustomerProfile } from "@/lib/demo-profile";

export default function CustomerMenuPage() {
  const me = loadCustomerProfile();
  const [qrOpen, setQrOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Halo {customerDisplayName(me)}</h1>

      <PointsBalanceCard points={me.points} />

      <PortalCard title="Menu">
        <div className="menu-grid">
          <MenuTile label="Kode Saya" onClick={() => setQrOpen(true)} icon={<IconQr />} />
          <MenuTile href="/portal/deposits" label="Riwayat setoran" icon={<IconHistory />} />
          <MenuTile href="/portal/rewards" label="Penukaran poin" icon={<IconRedeem />} />
          <MenuTile label="Bantuan" onClick={() => setHelpOpen(true)} icon={<IconHelp />} />
        </div>
      </PortalCard>

      <QrModal open={qrOpen} phone={me.phone} onClose={() => setQrOpen(false)} />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}