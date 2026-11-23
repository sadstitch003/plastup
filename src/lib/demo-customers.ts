export type CustomerType = "household" | "business" | "collector" | "coordinator";

export const CUSTOMER_TYPE_LABEL: Record<CustomerType, string> = {
  household: "Rumah tangga",
  business: "Usaha",
  collector: "Pengepul",
  coordinator: "Koordinator pengepul sampah",
};

export function customerTypeLabel(type: CustomerType | undefined) {
  return type ? CUSTOMER_TYPE_LABEL[type] : CUSTOMER_TYPE_LABEL.household;
}

export type DemoCustomerPick = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  nationalId: string;
  verifyStatus: "verified" | "none";
  customerType: CustomerType;
  /** Indeks 1..23 → `config/tps-sites` */
  homeSiteId: number;
};

const UNVERIFIED_POOL: Omit<DemoCustomerPick, "nationalId" | "verifyStatus">[] = [
  { id: "c-r1", firstName: "Rina", lastName: "Wulandari", phone: "081312345678", address: "Jl. Mawar No. 5", homeSiteId: 1, customerType: "household" },
  { id: "c-r2", firstName: "Joko", lastName: "Prasetyo", phone: "081355501122", address: "Dusun Krajan RT 02", homeSiteId: 2, customerType: "business" },
  { id: "c-r3", firstName: "Maya", lastName: "Sari", phone: "081399887766", address: "Perumahan Green Asri B12", homeSiteId: 3, customerType: "household" },
  { id: "c-r4", firstName: "Ahmad", lastName: "Fauzi", phone: "081277700003", address: "Kampung Baru 3/4", homeSiteId: 4, customerType: "collector" },
  { id: "c-r5", firstName: "Dewi", lastName: "Lestari", phone: "081288990011", address: "", homeSiteId: 5, customerType: "coordinator" },
];

export function customerDisplayName(c: Pick<DemoCustomerPick, "firstName" | "lastName" | "phone">) {
  const name = `${c.firstName} ${c.lastName}`.trim();
  return name || c.phone;
}

export function randomUnverifiedCustomer(): DemoCustomerPick {
  const base = UNVERIFIED_POOL[Math.floor(Math.random() * UNVERIFIED_POOL.length)];
  return {
    ...base,
    nationalId: "",
    verifyStatus: "none",
  };
}
