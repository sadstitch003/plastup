/** Matches `20261123092200_seed_demo_users.go` */
export const DEMO_CUSTOMER = {
  phone: "081234567801",
  password: "demo123",
} as const;

export const DEMO_STAFF = {
  username: "admin",
  password: "demo123",
} as const;

/** TPS tempat akun petugas demo login (field staff). */
export const DEMO_STAFF_SITE_ID = "1";

/** Berat tetap dari scan timbangan demo */
export const DEMO_BAG_WEIGHT_KG = 2.75;

export const customerQr = (phone: string) => `TPSUSER:${phone}`;

/** QR dummy di modal scan customer (pengumpulan). */
export const DUMMY_CUSTOMER_QR = "TPSUSER:000000000000";

export const scaleQr = (kg: number) => `TPSSCALE:${kg.toFixed(3)}`;