import type { NavItem } from "@/components/AppShell";
import { IconApps, IconHistory, IconRedeem } from "@/components/nav-icons";

export const CUSTOMER_NAV: NavItem[] = [
  { href: "/portal/menu", label: "Menu", icon: <IconApps /> },
  { href: "/portal/deposits", label: "Setoran", icon: <IconHistory /> },
  { href: "/portal/rewards", label: "Penukaran", icon: <IconRedeem /> },
];