"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { STAFF_NAV } from "@/config/staff-nav";
import { clearToken, getToken } from "@/lib/session";

const TAB_ROOTS = new Set([
  "/admin/dashboard",
  "/admin/deposits",
  "/admin/menu",
  "/admin/deposits/new",
  "/admin/shipments",
  "/admin/shipments/validate",
  "/admin/customers",
  "/admin/customers/new",
]);

function mobileBack(pathname: string) {
  if (TAB_ROOTS.has(pathname)) return "";
  if (pathname.startsWith("/admin/deposits/") && pathname !== "/admin/deposits/new") return "/admin/deposits";
  if (pathname.startsWith("/admin/customers/") && pathname !== "/admin/customers/new") return "/admin/customers";
  if (pathname.startsWith("/admin/shipments/validate/")) return "/admin/shipments/validate";
  if (pathname.startsWith("/admin/shipments/")) return "/admin/shipments";
  return "/admin/menu";
}

function LogoutBtn() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="staff-btn-outline"
      onClick={() => {
        clearToken("staff");
        router.replace("/admin/login");
      }}
    >
      Keluar
    </button>
  );
}

export default function StaffShellLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const back = mobileBack(pathname);

  useEffect(() => {
    if (!getToken("staff")) router.replace("/admin/login");
  }, [router]);

  return (
    <div className="staff-shell">
      <AppShell items={STAFF_NAV} brandHref="/admin/dashboard" footer={<LogoutBtn />}>
        {back ? (
          <p className="app-mobile-back">
            <Link href={back}>← Kembali</Link>
          </p>
        ) : null}
        {children}
      </AppShell>
    </div>
  );
}