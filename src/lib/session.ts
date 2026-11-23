const storageKey = "plastup_token";

export function getToken(kind: "customer" | "staff") {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${storageKey}_${kind}`);
}

export function setToken(kind: "customer" | "staff", token: string) {
  localStorage.setItem(`${storageKey}_${kind}`, token);
}

export function clearToken(kind: "customer" | "staff") {
  localStorage.removeItem(`${storageKey}_${kind}`);
}