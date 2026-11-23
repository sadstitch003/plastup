import { bagLabelForKey, isCanonicalBagCode, stableDemoBagCode } from "@/lib/bag-codes";
import { depositPublicId, demoDepositPublicId, nextDepositCode } from "@/lib/deposit-codes";
import { todayIso } from "@/lib/admin-format";
import { DEMO_DEPOSITS, totalKg, type DemoDeposit } from "@/lib/demo-dashboard";
import { rewardFromKg } from "@/lib/demo-rates";

export type DepositBagLine = {
  key: string;
  label: string;
  weightKg: number;
};

export type DepositListRow = {
  id: string;
  /** Waktu simpan (ISO). */
  createdAt: string;
  siteId: string;
  siteName: string;
  customerName: string;
  customerPhone: string;
  bagCount: number;
  weightKg: number;
  points: number;
  cash: number;
  status: "processing" | "completed";
  bags?: DepositBagLine[];
};

export type DispatchBagRow = DepositBagLine & {
  depositId: string;
  customerName: string;
};

const STORAGE_KEY = "demo.plastup.staff-deposits";

function bagOrderOnSiteDay(
  siteId: string,
  day: string,
  depositId: string,
  bagIndex: number,
  all: DepositListRow[],
): number {
  let order = 0;
  const deps = all
    .filter((d) => d.siteId === siteId && d.createdAt.slice(0, 10) === day)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  for (const dep of deps) {
    const count = dep.bags?.length ?? dep.bagCount;
    for (let i = 0; i < count; i += 1) {
      order += 1;
      if (dep.id === depositId && i === bagIndex) return order;
    }
  }
  return bagIndex + 1;
}

function readSaved(): DepositListRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DepositListRow[];
    if (!Array.isArray(parsed)) return [];
    const withDates = parsed.map((row) => ({
      ...row,
      createdAt: row.createdAt ?? `${(row as { date?: string }).date ?? todayFallback()}T12:00:00.000Z`,
    }));
    const demoRows = DEMO_DEPOSITS.map(fromDemo);
    const allForOrder = [...withDates, ...demoRows];
    return withDates.map((row) => ({
      ...row,
      bags: row.bags?.map((bag, i) => {
        const day = row.createdAt.slice(0, 10);
        if (isCanonicalBagCode(bag.label)) return bag;
        const order = bagOrderOnSiteDay(row.siteId, day, row.id, i, allForOrder);
        return { ...bag, label: bagLabelForKey(bag.key, day, order) };
      }),
    }));
  } catch {
    return [];
  }
}

export function countBagsForSiteDay(siteId: string, day: string = todayIso()): number {
  let n = 0;
  for (const d of listAllDeposits()) {
    if (d.siteId !== siteId || d.createdAt.slice(0, 10) !== day) continue;
    n += d.bags?.length ?? d.bagCount;
  }
  return n;
}

function writeSaved(rows: DepositListRow[]) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function todayFallback() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function bagLinesForDeposit(
  d: Pick<DepositListRow, "id" | "bagCount" | "weightKg" | "bags" | "siteId" | "createdAt">,
  all: DepositListRow[],
): DepositBagLine[] {
  if (d.bags?.length) return d.bags;
  if (d.bagCount <= 0) return [];
  const each = d.weightKg / d.bagCount;
  const day = d.createdAt.slice(0, 10);
  const isDemo = DEMO_DEPOSITS.some((dep) => demoDepositPublicId(dep, DEMO_DEPOSITS) === d.id);
  return Array.from({ length: d.bagCount }, (_, i) => {
    const key = `${d.id}-k${i + 1}`;
    const order = bagOrderOnSiteDay(d.siteId, day, d.id, i, all);
    return {
      key,
      label: isDemo ? stableDemoBagCode(d.id, i, DEMO_DEPOSITS) : bagLabelForKey(key, day, order),
      weightKg: Math.round(each * 1000) / 1000,
    };
  });
}

function fromDemo(d: DemoDeposit): DepositListRow {
  const kg = totalKg(d);
  const { points, cash } = rewardFromKg(kg);
  const publicId = demoDepositPublicId(d, DEMO_DEPOSITS);
  const bags: DepositBagLine[] = d.bags.map((bag, i) => ({
    key: `${publicId}-bag-${i + 1}`,
    label: stableDemoBagCode(publicId, i, DEMO_DEPOSITS),
    weightKg: bag.weightKg,
  }));
  return {
    id: publicId,
    createdAt: `${d.date}T09:00:00.000Z`,
    siteId: d.siteId,
    siteName: d.siteName,
    customerName: d.customerName,
    customerPhone: "—",
    bagCount: d.bags.length,
    weightKg: kg,
    points,
    cash,
    status: d.status,
    bags,
  };
}

/** Kantong di TPS yang belum dikirim ke terminal (demo). */
export function listDispatchableBags(siteId: string, excludeKeys: ReadonlySet<string>): DispatchBagRow[] {
  const out: DispatchBagRow[] = [];
  const all = listAllDeposits();
  for (const deposit of all) {
    if (deposit.siteId !== siteId || deposit.status !== "processing") continue;
    for (const bag of bagLinesForDeposit(deposit, all)) {
      if (excludeKeys.has(bag.key)) continue;
      out.push({
        ...bag,
        depositId: deposit.id,
        customerName: deposit.customerName,
      });
    }
  }
  return out;
}

export function depositBagCodeSummary(
  d: Pick<DepositListRow, "id" | "bagCount" | "weightKg" | "bags" | "siteId" | "createdAt">,
  all?: DepositListRow[],
): string {
  const pool = all ?? listAllDeposits();
  const lines = bagLinesForDeposit(d, pool);
  return lines.map((b) => b.label).join(" · ");
}

export function listAllDeposits(): DepositListRow[] {
  const demo = DEMO_DEPOSITS.map(fromDemo);
  const saved = readSaved();
  return [...saved, ...demo].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
}

export type NewDepositInput = Omit<DepositListRow, "id">;

export function addStaffDeposit(input: NewDepositInput): DepositListRow {
  const id = nextDepositCode(input, listAllDeposits());
  const row: DepositListRow = { ...input, id };
  const saved = readSaved();
  writeSaved([row, ...saved]);
  return row;
}

export function findStaffDepositById(id: string): DepositListRow | undefined {
  const all = listAllDeposits();
  return all.find((d) => d.id === id || depositPublicId(d, all) === id);
}

export function depositBagLines(deposit: DepositListRow, all?: DepositListRow[]): DepositBagLine[] {
  return bagLinesForDeposit(deposit, all ?? listAllDeposits());
}