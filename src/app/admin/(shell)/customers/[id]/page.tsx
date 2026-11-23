"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CUSTOMER_TYPE_LABEL, type CustomerType } from "@/lib/demo-customers";
import {
  getStaffCustomerById,
  updateStaffCustomer,
  verifyStaffCustomerNik,
} from "@/lib/demo-customer-store";
import { getTpsSites } from "@/lib/tps";

export default function StaffCustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = decodeURIComponent(String(params.id ?? ""));
  const sites = getTpsSites();
  const [tick, setTick] = useState(0);
  const user = useMemo(() => getStaffCustomerById(id), [id, tick]);

  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [homeSiteId, setHomeSiteId] = useState("1");
  const [customerType, setCustomerType] = useState<CustomerType>("household");
  const [nik, setNik] = useState("");
  const [err, setErr] = useState("");
  const [nikMsg, setNikMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const verified = user?.verifyStatus === "verified";

  useEffect(() => {
    if (!user) return;
    setPhone(user.phone);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address);
    setHomeSiteId(String(user.homeSiteId));
    setCustomerType(user.customerType ?? "household");
    setNik(user.nationalId ?? "");
    setErr("");
    setNikMsg("");
  }, [user]);

  if (!user) {
    return (
      <div>
        <h1 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 700 }}>Ubah pengguna</h1>
        <p style={{ color: "var(--muted)" }}>Pengguna tidak ditemukan.</p>
      </div>
    );
  }

  const verifyNik = () => {
    if (verified) return;
    setErr("");
    setNikMsg("");
    const updated = verifyStaffCustomerNik(user.id, nik);
    if (!updated) {
      setErr("NIK harus 16 digit.");
      return;
    }
    setNik(updated.nationalId);
    setNikMsg("NIK terverifikasi (demo)");
    setTick((n) => n + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const siteNum = Number(homeSiteId);
      if (!siteNum) throw new Error("Pilih TPS.");
      updateStaffCustomer(user.id, {
        phone,
        firstName,
        lastName,
        address,
        homeSiteId: siteNum,
        customerType,
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
      <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700 }}>Ubah pengguna</h1>

      <form onSubmit={submit} className="dispatch-bag-panel admin-customer-form">
        <div className="auth-field" style={{ marginTop: 0 }}>
          <label htmlFor="edit-fn">Nama depan *</label>
          <input id="edit-fn" className="admin-field-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="edit-ln">Nama belakang</label>
          <input id="edit-ln" className="admin-field-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="edit-phone">Nomor HP *</label>
          <input
            id="edit-phone"
            className="admin-field-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
        <div className="auth-field">
          <label htmlFor="edit-addr">Alamat</label>
          <input id="edit-addr" className="admin-field-input" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="auth-field">
          <label htmlFor="edit-type">Tipe pengguna *</label>
          <select
            id="edit-type"
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
          <label htmlFor="edit-tps">TPS *</label>
          <select
            id="edit-tps"
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
          <label htmlFor="edit-nik">NIK</label>
          <div className="admin-nik-row admin-nik-row--stacked">
            <input
              id="edit-nik"
              className={`admin-field-input admin-field-input--nik${verified ? " admin-field-input--readonly" : ""}`}
              value={nik}
              onChange={(e) => {
                if (verified) return;
                setNik(e.target.value);
                setNikMsg("");
              }}
              readOnly={verified}
              inputMode="numeric"
              placeholder="16 digit"
              autoComplete="off"
              maxLength={20}
              aria-readonly={verified}
            />
            {!verified ? (
              <button
                type="button"
                className="staff-btn-outline staff-btn-secondary pengumpulan-btn admin-nik-verify-btn"
                onClick={verifyNik}
              >
                Verifikasi NIK
              </button>
            ) : null}
          </div>
          {verified || nikMsg ? (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--green-dark)", fontWeight: 600 }}>
              {verified ? "NIK terverifikasi — tidak dapat diubah" : nikMsg}
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