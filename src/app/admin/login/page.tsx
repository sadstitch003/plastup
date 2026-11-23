"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { DEMO_STAFF } from "@/config/demo";
import { loginStaffDemo } from "@/lib/demo-auth";
import { setToken } from "@/lib/session";

export default function StaffLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>(DEMO_STAFF.username);
  const [password, setPassword] = useState<string>(DEMO_STAFF.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await loginStaffDemo(username, password);
      setToken("staff", token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Masuk" variant="staff">
      <form onSubmit={submit}>
        <div className="auth-field">
          <label htmlFor="username">Username *</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>
        <div className="auth-field">
          <label htmlFor="admin-pw">Kata sandi *</label>
          <PasswordField id="admin-pw" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        {error ? <p className="auth-error">{error}</p> : null}
        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? "Memuat…" : "Masuk"}
        </button>
      </form>
    </AuthShell>
  );
}