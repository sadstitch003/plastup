"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { CUSTOMER_TYPE_LABEL, type CustomerType } from "@/lib/demo-customers";
import { addStaffCustomer } from "@/lib/demo-customer-store";
import { getTpsSites } from "@/lib/tps";

export default function StaffRegisterCustomerPage() {
  const router = useRouter();
  const sites = getTpsSites();
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [homeSiteId, setHomeSiteId] = useState(DEMO_STAFF_SITE_ID);
  const [customerType, setCustomerType] = useState<CustomerType>("household");
  const [nik, setNik] = useState("");
  const [nikVerified, setNikVerified] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyNik = () => {
    const digits = nik.replace(/\D/g, "");
    if (digits.length !== 16) {
      setNikVerified(false);
      setErr("NIK harus 16 digit untuk diverifikasi.");
      return;
    }
    setNik(digits);
    setNikVerified(true);
    setErr("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const siteNum = Number(homeSiteId);
      if (!siteNum) throw new Error("Pilih TPS.");
      addStaffCustomer({
        phone,
        firstName,
        lastName,
        address,
        homeSiteId: siteNum,
        customerType,
        nationalId: nikVerified ? nik.replace(/\D/g, "") : "",
        verifyStatus: nikVerified ? "verified" : "none",
      });
      router.push("/admin/customers");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Daftar pengguna baru</h1>

      <form onSubmit={submit} className="dispatch-bag-panel admin-customer-form">
        <div className="auth-field" style={{ marginTop: 0 }}>
          <label htmlFor="adm-fn">Nama depan *</label>
          <input id="adm-fn" className="admin-field-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="adm-ln">Nama belakang</label>
          <input id="adm-ln" className="admin-field-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="adm-phone">Nomor HP *</label>
          <input
            id="adm-phone"
            className="admin-field-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="adm-addr">Alamat</label>
          <input id="adm-addr" className="admin-field-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="adm-type">Tipe pengguna *</label>
          <select
            id="adm-type"
            className="admin-field-input"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value as CustomerType)}
          >
            {(Object.entries(CUSTOMER_TYPE_LABEL) as [CustomerType, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="auth-field">
          <label htmlFor="adm-tps">TPS *</label>
          <select
            id="adm-tps"
            className="admin-field-input"
            value={homeSiteId}
            onChange={(e) => setHomeSiteId(e.target.value)}
          >
            {sites.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="auth-field admin-nik-field">
          <label htmlFor="adm-nik">NIK</label>
          <div className="admin-nik-row admin-nik-row--stacked">
            <input
              id="adm-nik"
              className="admin-field-input admin-field-input--nik"
              value={nik}
              onChange={(e) => {
                setNik(e.target.value);
                setNikVerified(false);
              }}
              inputMode="numeric"
              placeholder="16 digit"
              autoComplete="off"
              maxLength={20}
            />
            <button
              type="button"
              className="staff-btn-outline staff-btn-secondary pengumpulan-btn admin-nik-verify-btn"
              onClick={verifyNik}
            >
              Verifikasi NIK
            </button>
          </div>
          {nikVerified ? (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--green-dark)", fontWeight: 600 }}>
              NIK terverifikasi (demo)
            </p>
          ) : null}
        </div>
        {err ? <p className="auth-error">{err}</p> : null}
        <button type="submit" className="auth-btn-primary" disabled={loading} style={{ width: "100%", marginTop: 12 }}>
          {loading ? "Memuat…" : "Simpan"}
        </button>
      </form>
    </div>
  );
}