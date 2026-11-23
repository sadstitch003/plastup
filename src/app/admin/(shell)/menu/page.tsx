"use client";

import { MenuTile } from "@/components/MenuTile";
import { PortalCard } from "@/components/PortalCard";
import { IconBox, IconPeople, IconScale, IconTruck } from "@/components/nav-icons";

export default function StaffMenuHubPage() {
  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Menu</h1>
      <PortalCard title="Setoran">
        <div className="menu-grid">
          <MenuTile href="/admin/deposits/new" label="Pengumpulan" icon={<IconBox />} assetSrc="/icons/Eco-Friendly Blue Recycling Bag-8.png" />
          <MenuTile href="/admin/deposits" label="Daftar setoran" icon={<IconBox />} />
          <MenuTile href="/admin/shipments/dispatch" label="Setorkan sampah" icon={<IconTruck />} />
        </div>
      </PortalCard>
      <PortalCard title="Kirim TPA">
        <div className="menu-grid">
          <MenuTile href="/admin/shipments/validate" label="Validasi berat" icon={<IconScale />} />
          <MenuTile href="/admin/shipments" label="Daftar validasi berat" icon={<IconScale />} />
        </div>
      </PortalCard>
      <PortalCard title="Pengguna">
        <div className="menu-grid">
          <MenuTile href="/admin/customers" label="Daftar pengguna" icon={<IconPeople />} />
        </div>
      </PortalCard>
    </div>
  );
}