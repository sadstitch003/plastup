import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { TPS_SITE_NAMES } from "@/config/tps-sites";
import { customerDisplayName, type DemoCustomerPick } from "@/lib/demo-customers";

export type StaffCustomerRow = DemoCustomerPick & {
  registeredAt: string;
};

const STORAGE_KEY = "demo.plastup.staff-customers";

const SEED: StaffCustomerRow[] = [
  {
    id: "c-seed-1",
    firstName: "Christian",
    lastName: "",
    phone: "081234567890",
    address: "Jl. Kemuning No. 12",
    nationalId: "3525010101990001",
    verifyStatus: "verified",
    customerType: "household",
    homeSiteId: 1,
    registeredAt: "2026-11-20T10:00:00.000Z",
  },
  {
    id: "c-seed-2",
    firstName: "Siti",
    lastName: "Rahayu",
    phone: "081298761234",
    address: "RT 03 Kemuning Martajasah",
    nationalId: "",
    verifyStatus: "none",
    customerType: "household",
    homeSiteId: 1,
    registeredAt: "2026-11-21T11:00:00.000Z",
  },
  {
    id: "c-seed-3",
    firstName: "Rina",
    lastName: "Wulandari",
    phone: "081312345678",
    address: "Jl. Mawar No. 5",
    nationalId: "",
    verifyStatus: "none",
    customerType: "collector",
    homeSiteId: 1,
    registeredAt: "2026-11-22T08:30:00.000Z",
  },
  {
    id: "c-seed-4",
    firstName: "Ahmad",
    lastName: "Fauzi",
    phone: "081277700003",
    address: "Kampung Baru 3/4",
    nationalId: "3525011502880004",
    verifyStatus: "verified",
    customerType: "business",
    homeSiteId: 1,
    registeredAt: "2026-11-18T14:00:00.000Z",
  },
];

function readSaved(): StaffCustomerRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StaffCustomerRow[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) => ({
      ...row,
      customerType: row.customerType ?? "household",
    }));
  } catch {
    return [];
  }
}

function writeSaved(rows: StaffCustomerRow[]) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function siteNameForCustomer(homeSiteId: number) {
  return TPS_SITE_NAMES[homeSiteId - 1] ?? "—";
}

function mergeById(): Map<string, StaffCustomerRow> {
  const map = new Map<string, StaffCustomerRow>();
  for (const row of SEED) map.set(row.id, row);
  for (const row of readSaved()) map.set(row.id, row);
  return map;
}

function allStaffCustomersSorted(): StaffCustomerRow[] {
  return [...mergeById().values()].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
}

export function listAllStaffCustomers(): StaffCustomerRow[] {
  return allStaffCustomersSorted();
}

export function listStaffCustomers(siteId: string = DEMO_STAFF_SITE_ID): StaffCustomerRow[] {
  const siteNum = Number(siteId);
  return allStaffCustomersSorted().filter((row) => row.homeSiteId === siteNum);
}

export function getStaffCustomerById(id: string): StaffCustomerRow | undefined {
  return mergeById().get(id);
}

function persistCustomer(row: StaffCustomerRow) {
  const saved = readSaved().filter((c) => c.id !== row.id);
  writeSaved([row, ...saved]);
}

export type NewStaffCustomerInput = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  homeSiteId: number;
  nationalId?: string;
  verifyStatus?: DemoCustomerPick["verifyStatus"];
  customerType?: DemoCustomerPick["customerType"];
  password?: string;
};

export function addStaffCustomer(input: NewStaffCustomerInput): StaffCustomerRow {
  const phone = input.phone.trim();
  if (!phone) throw new Error("Nomor HP wajib diisi.");
  if (!input.firstName.trim()) throw new Error("Nama depan wajib diisi.");

  const existing = listStaffCustomers(String(input.homeSiteId));
  if (existing.some((c) => c.phone === phone)) {
    throw new Error("Nomor HP sudah terdaftar di TPS ini.");
  }

  const row: StaffCustomerRow = {
    id: `c-${Date.now()}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone,
    address: input.address.trim(),
    nationalId: (input.nationalId ?? "").trim(),
    verifyStatus: input.verifyStatus ?? "none",
    customerType: input.customerType ?? "household",
    homeSiteId: input.homeSiteId,
    registeredAt: new Date().toISOString(),
  };
  persistCustomer(row);
  return row;
}

export type UpdateStaffCustomerInput = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  homeSiteId: number;
  customerType: DemoCustomerPick["customerType"];
};

export function updateStaffCustomer(id: string, input: UpdateStaffCustomerInput): StaffCustomerRow {
  const current = getStaffCustomerById(id);
  if (!current) throw new Error("Pengguna tidak ditemukan.");
  const phone = input.phone.trim();
  if (!phone) throw new Error("Nomor HP wajib diisi.");
  if (!input.firstName.trim()) throw new Error("Nama depan wajib diisi.");

  const row: StaffCustomerRow = {
    ...current,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone,
    address: input.address.trim(),
    homeSiteId: input.homeSiteId,
    customerType: input.customerType,
    nationalId: current.nationalId,
    verifyStatus: current.verifyStatus,
  };
  persistCustomer(row);
  return row;
}

export function verifyStaffCustomerNik(id: string, nationalId: string): StaffCustomerRow | null {
  const digits = nationalId.replace(/\D/g, "");
  if (digits.length !== 16) return null;
  const current = getStaffCustomerById(id);
  if (!current) return null;
  if (current.verifyStatus === "verified") return null;
  const row: StaffCustomerRow = {
    ...current,
    nationalId: digits,
    verifyStatus: "verified",
  };
  persistCustomer(row);
  return row;
}

export const VERIFY_STATUS_LABEL: Record<DemoCustomerPick["verifyStatus"], string> = {
  verified: "Terverifikasi",
  none: "Belum verifikasi",
};