import type { DemoDeposit } from "@/lib/demo-dashboard";

type DepositLike = {
  id: string;
  createdAt: string;
  siteId: string;
};

/** Kode harian: prefiks + MM + DD + urutan (2 digit), tanpa strip. */
export function formatDayOrderCode(prefix: string, dateYmd: string, order: number) {
  const parts = dateYmd.slice(0, 10).split("-");
  const mm = parts[1] ?? "01";
  const dd = parts[2] ?? "01";
  const xx = String(Math.max(1, order)).padStart(2, "0");
  return `${prefix}${mm}${dd}${xx}`;
}

/** Kode setoran: S + MMDDXX */
export function formatDepositCode(dateYmd: string, order: number) {
  return formatDayOrderCode("S", dateYmd, order);
}

/** Kode kantong: K + MMDDXX */
export function formatBagCode(dateYmd: string, order: number) {
  return formatDayOrderCode("K", dateYmd, order);
}

/** Kode pengiriman ke TPA: P + MMDDXX */
export function formatShipmentCode(dateYmd: string, order: number) {
  return formatDayOrderCode("P", dateYmd, order);
}

export function isDayOrderCode(prefix: string, id: string) {
  return new RegExp(`^${prefix}\\d{6}$`).test(id);
}

export function isDepositCode(id: string) {
  return isDayOrderCode("S", id);
}

export function isBagCode(id: string) {
  return isDayOrderCode("K", id);
}

export function isShipmentCode(id: string) {
  return isDayOrderCode("P", id);
}

function orderAmongPeers<T extends { id: string }>(item: T, peers: T[]) {
  const sorted = [...peers].sort((a, b) => a.id.localeCompare(b.id));
  const idx = sorted.findIndex((p) => p.id === item.id);
  return idx >= 0 ? idx + 1 : sorted.length + 1;
}

export function demoDepositPublicId(d: DemoDeposit, all: DemoDeposit[]): string {
  const peers = all.filter((x) => x.date === d.date && x.siteId === d.siteId);
  return formatDepositCode(d.date, orderAmongPeers(d, peers));
}

export function depositPublicId(row: DepositLike, all: DepositLike[]): string {
  if (isDepositCode(row.id)) return row.id;
  const day = row.createdAt.slice(0, 10);
  const peers = all.filter((d) => d.createdAt.slice(0, 10) === day && d.siteId === row.siteId);
  const order = orderAmongPeers(
    { id: row.id },
    peers.map((p) => ({ id: p.id })),
  );
  return formatDepositCode(day, order);
}

export function nextDepositCode(input: Pick<DepositLike, "createdAt" | "siteId">, all: DepositLike[]) {
  const day = input.createdAt.slice(0, 10);
  const count = all.filter((d) => d.createdAt.slice(0, 10) === day && d.siteId === input.siteId).length;
  return formatDepositCode(day, count + 1);
}