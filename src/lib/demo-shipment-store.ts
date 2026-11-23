import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { formatShipmentCode, isShipmentCode } from "@/lib/deposit-codes";
import { todayIso } from "@/lib/admin-format";

export type ShipmentStatus = "draft" | "dispatched" | "arrived";

export type ShipmentBagLine = {
  key: string;
  label: string;
  depositId: string;
  customerName: string;
  declaredKg: number;
  receivedKg: number | null;
};

export type ShipmentRow = {
  id: string;
  siteId: string;
  siteName: string;
  status: ShipmentStatus;
  declaredKg: number;
  receivedKg: number | null;
  createdAt: string;
  bags?: ShipmentBagLine[];
};

export type DispatchBagSnapshot = {
  key: string;
  label: string;
  depositId: string;
  customerName: string;
  weightKg: number;
};

const STORAGE_KEY = "demo.plastup.shipments";
const SENT_BAGS_KEY = "demo.plastup.sent-bags";

/** Hasil validasi berat — hanya RAM; hilang saat refresh tab. */
const validationMemory = new Map<string, ShipmentRow>();

const STAFF_SITE_NAME = "Kemuning Martajasah";

function synthBagsForDeclared(declaredKg: number, shipmentId: string): ShipmentBagLine[] {
  const n = declaredKg < 4 ? 1 : declaredKg < 9 ? 2 : 3;
  const raw = Array.from({ length: n }, (_, i) => {
    const share = i === n - 1 ? declaredKg - (Math.floor((declaredKg / n) * 1000) / 1000) * (n - 1) : Math.floor((declaredKg / n) * 1000) / 1000;
    return Math.max(0.001, Number(share.toFixed(3)));
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  const adjust = Number((declaredKg - sum + raw[n - 1]).toFixed(3));
  raw[n - 1] = adjust;
  const day = shipmentId.slice(1, 7);
  return raw.map((kg, i) => ({
    key: `${shipmentId}-bag-${i + 1}`,
    label: `K${day}${String(i + 1).padStart(2, "0")}`,
    depositId: `S${day}${String(i + 1).padStart(2, "0")}`,
    customerName: i % 2 === 0 ? "Siti Rahayu" : "Christian",
    declaredKg: kg,
    receivedKg: null,
  }));
}

function bagsForShipment(row: ShipmentRow): ShipmentBagLine[] {
  if (row.bags?.length) return row.bags;
  return synthBagsForDeclared(row.declaredKg, row.id);
}

export function shipmentBagLines(row: ShipmentRow): ShipmentBagLine[] {
  return bagsForShipment(row);
}

function offsetDay(iso: string, delta: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${month}-${day}`;
}

/** Contoh kiriman tetap — tidak dihapus saat reset setorkan. */
function demoShipmentSeed(): ShipmentRow[] {
  const t = todayIso();
  const y = offsetDay(t, -1);
  const w = offsetDay(t, -3);
  return [
    {
      id: formatShipmentCode(t, 1),
      siteId: DEMO_STAFF_SITE_ID,
      siteName: STAFF_SITE_NAME,
      status: "dispatched",
      declaredKg: 7.6,
      receivedKg: null,
      createdAt: `${t}T08:15:00.000Z`,
      bags: synthBagsForDeclared(7.6, formatShipmentCode(t, 1)),
    },
    {
      id: formatShipmentCode(t, 2),
      siteId: DEMO_STAFF_SITE_ID,
      siteName: STAFF_SITE_NAME,
      status: "dispatched",
      declaredKg: 12.35,
      receivedKg: null,
      createdAt: `${t}T11:20:00.000Z`,
      bags: synthBagsForDeclared(12.35, formatShipmentCode(t, 2)),
    },
    {
      id: formatShipmentCode(y, 1),
      siteId: DEMO_STAFF_SITE_ID,
      siteName: STAFF_SITE_NAME,
      status: "arrived",
      declaredKg: 9.8,
      receivedKg: 9.72,
      createdAt: `${y}T15:40:00.000Z`,
    },
    {
      id: formatShipmentCode(y, 2),
      siteId: DEMO_STAFF_SITE_ID,
      siteName: STAFF_SITE_NAME,
      status: "arrived",
      declaredKg: 4.1,
      receivedKg: 4.05,
      createdAt: `${y}T09:05:00.000Z`,
    },
    {
      id: formatShipmentCode(w, 1),
      siteId: DEMO_STAFF_SITE_ID,
      siteName: STAFF_SITE_NAME,
      status: "arrived",
      declaredKg: 6.55,
      receivedKg: 6.48,
      createdAt: `${w}T16:10:00.000Z`,
    },
  ];
}

function readSession(): ShipmentRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShipmentRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSession(rows: ShipmentRow[]) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function mergeShipments(): ShipmentRow[] {
  const map = new Map<string, ShipmentRow>();
  for (const row of demoShipmentSeed()) map.set(row.id, row);
  for (const row of readSession()) map.set(row.id, row);
  for (const row of validationMemory.values()) map.set(row.id, row);
  return [...map.values()];
}

/** Reset demo validasi (refresh tab). */
export function clearValidationDemoSession() {
  validationMemory.clear();
}

function seedPendingShipmentIds(): Set<string> {
  return new Set(
    demoShipmentSeed()
      .filter((s) => s.status === "dispatched" && s.receivedKg == null)
      .map((s) => s.id),
  );
}

/**
 * Pastikan contoh kiriman menunggu validasi tampil lagi.
 * Hapus overlay session/validasi pada kode kiriman seed yang masih pending.
 */
export function prepareValidationDemoList() {
  clearValidationDemoSession();
  if (typeof window === "undefined") return;
  const pendingIds = seedPendingShipmentIds();
  const kept = readSession().filter((s) => !pendingIds.has(s.id));
  writeSession(kept);
}

function readAll(): ShipmentRow[] {
  if (typeof window === "undefined") return demoShipmentSeed();
  return mergeShipments();
}

function persistShipmentUpdate(row: ShipmentRow) {
  const session = readSession();
  const others = session.filter((s) => s.id !== row.id);
  writeSession([row, ...others]);
}

function shipmentDayCount(siteId: string, day: string, rows: ShipmentRow[]) {
  return rows.filter(
    (s) => s.siteId === siteId && s.createdAt.slice(0, 10) === day && s.status !== "draft",
  ).length;
}

export function listShipments(): ShipmentRow[] {
  return readAll();
}

/** Reset kantong terkirim + kiriman buatan sesi di halaman setorkan; seed demo tetap. */
export function resetDispatchDemoSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SENT_BAGS_KEY);
  validationMemory.clear();
}

export function listSentBagKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SENT_BAGS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function markBagsSent(keys: string[]) {
  const prev = listSentBagKeys();
  keys.forEach((k) => prev.add(k));
  window.sessionStorage.setItem(SENT_BAGS_KEY, JSON.stringify([...prev]));
}

export function createDispatch(
  siteId: string,
  siteName: string,
  declaredKg: number,
  snapshot: DispatchBagSnapshot[] = [],
): ShipmentRow {
  const now = new Date().toISOString();
  const day = now.slice(0, 10);
  const existing = readAll();
  const order = shipmentDayCount(siteId, day, existing) + 1;
  const id = formatShipmentCode(day, order);
  const bags: ShipmentBagLine[] = snapshot.map((b) => ({
    key: b.key,
    label: b.label,
    depositId: b.depositId,
    customerName: b.customerName,
    declaredKg: b.weightKg,
    receivedKg: null,
  }));
  const row: ShipmentRow = {
    id,
    siteId,
    siteName,
    status: "dispatched",
    declaredKg,
    receivedKg: null,
    createdAt: now,
    bags: bags.length ? bags : synthBagsForDeclared(declaredKg, id),
  };
  const session = readSession().filter((s) => isShipmentCode(s.id));
  writeSession([row, ...session]);
  return row;
}

export const SHIPMENT_STATUS_LABEL: Record<ShipmentStatus, string> = {
  draft: "Draf",
  dispatched: "Dikirim ke terminal",
  arrived: "Tiba di TPA",
};

/** Untuk daftar pengiriman petugas TPS. */
export function shipmentArrivalLabel(status: ShipmentStatus) {
  return status === "arrived" ? "Sampai" : "Belum Sampai";
}

export function listStaffShipments(siteId: string): ShipmentRow[] {
  return readAll()
    .filter((s) => s.siteId === siteId && s.status !== "draft" && s.declaredKg > 0)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/** Kiriman yang masih perlu diisi berat terima (TPS → TPA). */
export function listPendingValidation(siteId: string): ShipmentRow[] {
  return listStaffShipments(siteId).filter((s) => s.status === "dispatched" && s.receivedKg == null);
}

export function getShipmentById(id: string): ShipmentRow | undefined {
  return readAll().find((s) => s.id === id);
}

export function recordReceivedWeight(id: string, receivedKg: number): ShipmentRow | null {
  if (!(receivedKg > 0)) return null;
  const current = getShipmentById(id);
  if (!current || current.receivedKg != null) return null;
  const row: ShipmentRow = { ...current, receivedKg, status: "arrived" };
  validationMemory.set(id, row);
  return row;
}

/** Validasi per kantong — total terima = jumlah berat kantong. */
export function recordShipmentBagValidation(
  id: string,
  receivedByKey: Record<string, number>,
): ShipmentRow | null {
  const current = getShipmentById(id);
  if (!current || current.receivedKg != null) return null;
  const base = bagsForShipment(current);
  let total = 0;
  const bags: ShipmentBagLine[] = [];
  for (const line of base) {
    const kg = Number(receivedByKey[line.key]);
    if (!(kg > 0)) return null;
    total += kg;
    bags.push({ ...line, receivedKg: Number(kg.toFixed(3)) });
  }
  if (!bags.length) return null;
  const row: ShipmentRow = {
    ...current,
    bags,
    receivedKg: Number(total.toFixed(3)),
    status: "arrived",
  };
  validationMemory.set(id, row);
  return row;
}

export function validationStatusLabel(row: ShipmentRow) {
  if (row.receivedKg != null) return "Selesai";
  if (row.status === "dispatched") return "Menunggu";
  return "—";
}