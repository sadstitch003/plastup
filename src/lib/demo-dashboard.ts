import { TPS_SITE_NAMES } from "@/config/tps-sites";
import { todayIso } from "@/lib/admin-format";

export type BagStatus = "processing" | "done";

export const BAG_STATUS_LABEL: Record<BagStatus, string> = {
  processing: "Dalam proses",
  done: "Divalidasi",
};

export type DemoBag = {
  id: string;
  status: BagStatus;
  weightKg: number;
  finalWeightKg: number | null;
};

export type DepositStage = "processing" | "validated" | "done";

export const DEPOSIT_STAGE_LABEL: Record<DepositStage, string> = {
  processing: "Diproses",
  validated: "Divalidasi",
  done: "Selesai",
};

export type DemoDeposit = {
  id: string;
  date: string;
  siteId: string;
  siteName: string;
  customerName: string;
  status: "processing" | "completed";
  rewardAmount: number | null;
  bags: DemoBag[];
};

export type DemoSite = { id: string; name: string };

export const DEMO_SITES: DemoSite[] = TPS_SITE_NAMES.map((name, i) => ({
  id: String(i + 1),
  name,
}));

const t = todayIso();
const y = offsetDay(t, -1);
const w = offsetDay(t, -3);

function offsetDay(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${month}-${day}`;
}

function bags(...items: [BagStatus, number, number | null][]): DemoBag[] {
  return items.map(([status, weightKg, finalWeightKg], i) => ({
    id: `bag-${i}`,
    status,
    weightKg,
    finalWeightKg,
  }));
}

export const DEMO_DEPOSITS: DemoDeposit[] = [
  {
    id: "DEP-2401",
    date: t,
    siteId: "1",
    siteName: DEMO_SITES[0].name,
    customerName: "Christian",
    status: "processing",
    rewardAmount: null,
    bags: bags(["processing", 2.4, null], ["done", 1.1, 1.0]),
  },
  {
    id: "DEP-2402",
    date: t,
    siteId: "1",
    siteName: DEMO_SITES[0].name,
    customerName: "Siti Rahayu",
    status: "processing",
    rewardAmount: null,
    bags: bags(["done", 3.2, 3.15], ["done", 0.9, 0.88]),
  },
  {
    id: "DEP-2406",
    date: t,
    siteId: "1",
    siteName: DEMO_SITES[0].name,
    customerName: "Maya Sari",
    status: "processing",
    rewardAmount: null,
    bags: bags(["done", 2.1, 2.05], ["done", 1.55, 1.52]),
  },
  {
    id: "DEP-2407",
    date: t,
    siteId: "1",
    siteName: DEMO_SITES[0].name,
    customerName: "Rina Wulandari",
    status: "processing",
    rewardAmount: null,
    bags: bags(["done", 1.25, 1.23], ["processing", 0.95, null]),
  },
  {
    id: "DEP-2403",
    date: t,
    siteId: "2",
    siteName: DEMO_SITES[1].name,
    customerName: "Budi Santoso",
    status: "completed",
    rewardAmount: 45,
    bags: bags(["done", 4.5, 4.48]),
  },
  {
    id: "DEP-2398",
    date: t,
    siteId: "3",
    siteName: DEMO_SITES[2].name,
    customerName: "Dewi Lestari",
    status: "processing",
    rewardAmount: null,
    bags: bags(["processing", 1.8, null], ["processing", 2.0, null]),
  },
  {
    id: "DEP-2395",
    date: y,
    siteId: "1",
    siteName: DEMO_SITES[0].name,
    customerName: "Ahmad Fauzi",
    status: "completed",
    rewardAmount: 28,
    bags: bags(["done", 2.8, 2.75]),
  },
  {
    id: "DEP-2390",
    date: y,
    siteId: "4",
    siteName: DEMO_SITES[3].name,
    customerName: "Rina Wulandari",
    status: "processing",
    rewardAmount: null,
    bags: bags(["done", 1.2, 1.19], ["processing", 0.7, null]),
  },
  {
    id: "DEP-2380",
    date: w,
    siteId: "2",
    siteName: DEMO_SITES[1].name,
    customerName: "Joko Prasetyo",
    status: "completed",
    rewardAmount: 62,
    bags: bags(["done", 3.1, 3.08], ["done", 3.0, 2.99]),
  },
  {
    id: "DEP-2375",
    date: w,
    siteId: "5",
    siteName: DEMO_SITES[4].name,
    customerName: "Maya Sari",
    status: "completed",
    rewardAmount: 18,
    bags: bags(["done", 1.8, 1.77]),
  },
];

export const totalKg = (d: Pick<DemoDeposit, "bags">) => d.bags.reduce((sum, bag) => sum + bag.weightKg, 0);

function allBagsValidated(d: Pick<DemoDeposit, "bags">) {
  return d.bags.length > 0 && d.bags.every((bag) => bag.finalWeightKg != null && bag.finalWeightKg > 0);
}

export function depositStage(d: Pick<DemoDeposit, "bags" | "rewardAmount">): DepositStage {
  if (d.rewardAmount != null && d.rewardAmount > 0) return "done";
  return allBagsValidated(d) ? "validated" : "processing";
}