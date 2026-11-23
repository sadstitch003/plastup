import { demoDepositPublicId, formatBagCode } from "@/lib/deposit-codes";
import { DEMO_DEPOSITS, type DemoDeposit } from "@/lib/demo-dashboard";

const LABEL_BY_KEY = "demo.plastup.bag-code-by-key";

function readLabelMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(LABEL_BY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLabelMap(map: Record<string, string>) {
  window.sessionStorage.setItem(LABEL_BY_KEY, JSON.stringify(map));
}

/** Kantong demo: urutan per TPS per hari (tanggal setoran). */
export function stableDemoBagCode(depositId: string, bagIndex: number, all: DemoDeposit[] = DEMO_DEPOSITS): string {
  const byDaySite = new Map<string, DemoDeposit[]>();
  for (const dep of all) {
    const bucket = `${dep.siteId}:${dep.date}`;
    const list = byDaySite.get(bucket) ?? [];
    list.push(dep);
    byDaySite.set(bucket, list);
  }

  for (const deps of byDaySite.values()) {
    deps.sort((a, b) => a.id.localeCompare(b.id));
    const sample = deps[0];
    if (!sample) continue;

    let order = 0;
    for (const dep of deps) {
      const publicId = demoDepositPublicId(dep, all);
      for (let i = 0; i < dep.bags.length; i += 1) {
        order += 1;
        if (publicId === depositId && i === bagIndex) return formatBagCode(dep.date, order);
      }
    }
  }

  return formatBagCode(DEMO_DEPOSITS[0]?.date ?? "1970-01-01", bagIndex + 1);
}

/** Simpan label kantong unik untuk sesi demo. */
export function allocateBagCode(bagKey: string, dateYmd: string, orderOnDay: number): string {
  const map = readLabelMap();
  const existing = map[bagKey];
  if (existing && isCanonicalBagCode(existing)) return existing;

  const label = formatBagCode(dateYmd, orderOnDay);
  map[bagKey] = label;
  writeLabelMap(map);
  return label;
}

export function bagLabelForKey(bagKey: string, dateYmd: string, orderOnDay: number): string {
  const map = readLabelMap();
  const existing = map[bagKey];
  if (existing && isCanonicalBagCode(existing)) return existing;
  if (existing && /^K\d{4}$/.test(existing)) {
    return allocateBagCode(bagKey, dateYmd, orderOnDay);
  }
  return allocateBagCode(bagKey, dateYmd, orderOnDay);
}

export function isCanonicalBagCode(label: string) {
  return /^K\d{6}$/.test(label);
}