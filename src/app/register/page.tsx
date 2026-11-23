"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { LegalModal } from "@/components/LegalModal";
import { PasswordField } from "@/components/PasswordField";
import { STATIC_LEGAL } from "@/config/legal";
import { saveCustomerProfile } from "@/lib/demo-profile";
import { registerCustomerDemo } from "@/lib/demo-auth";
import { setToken } from "@/lib/session";
import { getTpsSites, type SiteRow } from "@/lib/tps";

type LegalDoc = { id: number; title: string; body: string };

export default function RegisterPage() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [privacy, setPrivacy] = useState<LegalDoc | null>(null);
  const [terms, setTerms] = useState<LegalDoc | null>(null);
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [homeSiteId, setHomeSiteId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSites(getTpsSites());
    setPrivacy(STATIC_LEGAL.privacyPolicy);
    setTerms(STATIC_LEGAL.userAgreement);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    if (!homeSiteId) {
      setError("Pilih TPS Anda.");
      return;
    }
    if (!firstName.trim()) {
      setError("Nama depan wajib diisi.");
      return;
    }
    if (!phone.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }
    if (!acceptPrivacy || !acceptTerms) {
      setError("Centang kebijakan privasi dan perjanjian pengguna.");
      return;
    }
    setLoading(true);
    try {
      const token = await registerCustomerDemo({ firstName, phone, password });
      saveCustomerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        homeSiteId: Number(homeSiteId),
        points: 0,
      });
      setToken("customer", token);
      router.push("/portal/menu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal daftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthShell title="Daftar">
        <form onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="firstName">Nama depan *</label>
            <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label htmlFor="lastName">Nama belakang</label>
            <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-phone">Nomor HP *</label>
            <input id="reg-phone" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
          <div className="auth-field">
            <label htmlFor="address">Alamat</label>
            <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="auth-field">
            <label htmlFor="tps">TPS Anda *</label>
            <select id="tps" value={homeSiteId} onChange={(e) => setHomeSiteId(e.target.value)}>
              <option value="">— Pilih —</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="auth-field">
            <label htmlFor="reg-pw">Kata sandi *</label>
            <PasswordField id="reg-pw" value={password} onChange={setPassword} autoComplete="new-password" />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-pw2">Ulangi kata sandi *</label>
            <PasswordField id="reg-pw2" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          </div>

          <div className="auth-legal">
            <label>
              <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
              <span>
                Saya setuju{" "}
                <button type="button" className="link" onClick={() => privacy && setModal({ title: privacy.title, body: privacy.body })}>
                  Kebijakan Privasi
                </button>
              </span>
            </label>
            <label>
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
              <span>
                Saya setuju{" "}
                <button type="button" className="link" onClick={() => terms && setModal({ title: terms.title, body: terms.body })}>
                  Perjanjian Pengguna
                </button>
              </span>
            </label>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Memuat…" : "Daftar"}
          </button>
          <p className="auth-link-row">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
        </form>
      </AuthShell>
      {modal ? <LegalModal title={modal.title} body={modal.body} onClose={() => setModal(null)} /> : null}
    </>
  );
}