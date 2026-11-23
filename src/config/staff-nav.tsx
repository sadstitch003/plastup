import type { NavItem } from "@/components/AppShell";
import { IconApps, IconBox, IconDashboard, IconPeople, IconScale, IconTruck } from "@/components/nav-icons";

const menuTab: NavItem = { href: "/admin/menu", label: "Menu", icon: <IconApps />, mobileOnly: true };

export const STAFF_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <IconDashboard /> },
  { href: "/admin/deposits/new", label: "Pengumpulan", icon: <IconBox />, group: "Setoran", desktopOnly: true },
  { href: "/admin/deposits", label: "Daftar setoran", icon: <IconBox />, group: "Setoran" },
  { href: "/admin/shipments/dispatch", label: "Setorkan sampah", icon: <IconTruck />, group: "Setoran", desktopOnly: true },
  { href: "/admin/shipments/validate", label: "Validasi berat", icon: <IconScale />, group: "Kirim TPA", desktopOnly: true },
  { href: "/admin/shipments", label: "Daftar validasi berat", icon: <IconScale />, group: "Kirim TPA", desktopOnly: true },
  { href: "/admin/customers", label: "Daftar pengguna", icon: <IconPeople />, group: "Pengguna", desktopOnly: true },
  menuTab,
];