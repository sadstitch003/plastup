"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { DEMO_CUSTOMER } from "@/config/demo";
import { saveCustomerProfile } from "@/lib/demo-profile";
import { loginCustomerDemo } from "@/lib/demo-auth";
import { setToken } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState<string>(DEMO_CUSTOMER.phone);
  const [password, setPassword] = useState<string>(DEMO_CUSTOMER.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await loginCustomerDemo(phone, password);
      saveCustomerProfile({ phone: phone.trim(), firstName: "Christian", lastName: "", points: 120 });
      setToken("customer", token);
      router.push("/portal/menu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Masuk" variant="customer">
      <form onSubmit={submit}>
        <div className="auth-field">
          <label htmlFor="phone">
            Nomor HP <span style={{ color: "#b00020" }}>*</span>
          </label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        </div>
        <div className="auth-field">
          <label htmlFor="password">
            Kata sandi <span style={{ color: "#b00020" }}>*</span>
          </label>
          <PasswordField id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        {error ? <p className="auth-error">{error}</p> : null}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? "Memuat…" : "Masuk"}
        </button>
        <p className="auth-link-row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden style={{ color: "var(--muted)" }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-1a6 6 0 0 1 12 0v1" />
          </svg>
          <span>
            Belum punya akun? <Link href="/register">Daftar</Link>
          </span>
        </p>
      </form>
    </AuthShell>
  );
}