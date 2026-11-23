import { todayIso } from "@/lib/admin-format";
import { listAllDeposits } from "@/lib/demo-deposit-store";
import type { CustomerProfile } from "@/lib/demo-profile";
import { customerDisplayName } from "@/lib/demo-profile";
import { rewardFromKg } from "@/lib/demo-rates";
import { DEMO_SITES } from "@/lib/demo-dashboard";

export type CustomerDepositHistoryRow = {
  id: string;
  date: string;
  siteName: string;
  weightKg: number;
  cash: number;
  points: number;
};

function offsetDay(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${month}-${day}`;
}

function seedForProfile(profile: CustomerProfile): CustomerDepositHistoryRow[] {
  const t = todayIso();
  const home = DEMO_SITES[(profile.homeSiteId ?? 1) - 1] ?? DEMO_SITES[0];
  const rows: { id: string; date: string; siteName: string; weightKg: number }[] = [
    { id: "mine-1", date: t, siteName: home.name, weightKg: 3.5 },
    { id: "mine-2", date: offsetDay(t, -2), siteName: home.name, weightKg: 2.1 },
    { id: "mine-3", date: offsetDay(t, -7), siteName: DEMO_SITES[1]?.name ?? home.name, weightKg: 5.4 },
    { id: "mine-4", date: offsetDay(t, -14), siteName: home.name, weightKg: 1.8 },
  ];
  return rows.map((r) => {
    const { points, cash } = rewardFromKg(r.weightKg);
    return { ...r, points, cash };
  });
}

function matchesProfile(row: { customerName: string; customerPhone: string }, profile: CustomerProfile) {
  const name = customerDisplayName(profile).toLowerCase();
  const rowName = row.customerName.trim().toLowerCase();
  if (rowName && (rowName === name || rowName === profile.firstName.trim().toLowerCase())) return true;
  if (row.customerPhone && row.customerPhone !== "—" && row.customerPhone === profile.phone) return true;
  return false;
}

/** Riwayat setoran untuk portal pelanggan (demo). */
export function listCustomerDepositHistory(profile: CustomerProfile): CustomerDepositHistoryRow[] {
  const fromStaff = listAllDeposits()
    .filter((d) => matchesProfile(d, profile))
    .map((d) => ({
      id: d.id,
      date: d.createdAt.slice(0, 10),
      siteName: d.siteName,
      weightKg: d.weightKg,
      cash: d.cash,
      points: d.points,
    }));

  const seed = seedForProfile(profile);
  const seen = new Set(fromStaff.map((d) => d.id));
  const merged = [...fromStaff, ...seed.filter((d) => !seen.has(d.id))];
  return merged.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
