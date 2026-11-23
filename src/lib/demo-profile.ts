const profileKey = "plastup_customer_profile";

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  points: number;
  homeSiteId?: number;
};

const defaultProfile: CustomerProfile = {
  firstName: "Christian",
  lastName: "",
  phone: "081234567801",
  points: 120,
};

export function loadCustomerProfile(): CustomerProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = localStorage.getItem(profileKey);
    if (!raw) return defaultProfile;
    const parsed = { ...defaultProfile, ...JSON.parse(raw) } as CustomerProfile;
    if (parsed.phone === defaultProfile.phone && (parsed.firstName === "Demo" || parsed.firstName === "Demo Penyetor")) {
      parsed.firstName = "Christian";
      parsed.lastName = "";
    }
    return parsed;
  } catch {
    return defaultProfile;
  }
}

export function saveCustomerProfile(p: Partial<CustomerProfile>) {
  const next = { ...loadCustomerProfile(), ...p };
  localStorage.setItem(profileKey, JSON.stringify(next));
}

export function customerDisplayName(p: CustomerProfile) {
  const n = `${p.firstName} ${p.lastName}`.trim();
  return n || p.phone;
}