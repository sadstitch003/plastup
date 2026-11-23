"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { CUSTOMER_NAV } from "@/config/customer-nav";
import { clearToken, getToken } from "@/lib/session";

function LogoutBtn() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="staff-btn-outline"
      onClick={() => {
        clearToken("customer");
        router.replace("/login");
      }}
    >
      Keluar
    </button>
  );
}

export default function CustomerPortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken("customer")) router.replace("/login");
  }, [router]);

  return (
    <AppShell items={CUSTOMER_NAV} brandHref="/portal/menu" footer={<LogoutBtn />}>
      {children}
    </AppShell>
  );
}