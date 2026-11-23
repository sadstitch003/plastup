import Image from "next/image";
import Link from "next/link";
import { BRAND_LINE } from "@/config/brand";

type AuthVariant = "customer" | "staff";

export function AuthShell({
  title,
  children,
  variant = "customer",
}: {
  title: string;
  children: React.ReactNode;
  variant?: AuthVariant;
}) {
  const homeHref = variant === "staff" ? "/admin/login" : "/login";

  return (
    <main className={`auth-page auth-page--${variant}`}>
      <div className="auth-page-inner">
        <Link href={homeHref} className="auth-brand">
          <Image src="/brand/logo.png" alt="" width={52} height={52} style={{ borderRadius: 10, flexShrink: 0 }} priority />
          <p className="auth-brand-text">{BRAND_LINE}</p>
        </Link>
        <div className={`auth-card auth-card--${variant}`}>
          <h2 className="auth-card-title">{title}</h2>
          {children}
        </div>
      </div>
    </main>
  );
}