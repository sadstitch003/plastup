"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScaleScanModal } from "@/components/admin/ScaleScanModal";
import { ScanModal } from "@/components/admin/ScanModal";
import { DEMO_BAG_WEIGHT_KG, DEMO_STAFF_SITE_ID, DUMMY_CUSTOMER_QR } from "@/config/demo";
import { TPS_SITE_NAMES } from "@/config/tps-sites";
import { allocateBagCode } from "@/lib/bag-codes";
import { todayIso } from "@/lib/admin-format";
import { customerDisplayName, randomUnverifiedCustomer, type DemoCustomerPick } from "@/lib/demo-customers";
import { PlasticRateHint, PlasticRates, RewardSummary } from "@/components/admin/RewardSummary";
import { addStaffDeposit, countBagsForSiteDay } from "@/lib/demo-deposit-store";
import { rewardFromKg } from "@/lib/demo-rates";

const WASTE_TYPES = [{ id: "plastik", name: "Plastik" }] as const;

const SITES = TPS_SITE_NAMES.map((name, i) => ({ id: String(i + 1), name }));


type BagDraft = { key: string; index: number; label: string; weight: string; wasteTypeId: string };

export default function StaffPengumpulanPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<DemoCustomerPick[]>([]);
  const [picked, setPicked] = useState<DemoCustomerPick | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scaleScanKey, setScaleScanKey] = useState<string | null>(null);
  const bagNo = useRef(0);
  const [countText, setCountText] = useState("");
  const [bags, setBags] = useState<BagDraft[]>([]);
  const [error, setError] = useState("");
  const siteId = DEMO_STAFF_SITE_ID;

  const newBag = (index: number): BagDraft => {
    bagNo.current += 1;
    const seq = bagNo.current;
    const key = `b-${seq}`;
    const day = todayIso();
    const order = countBagsForSiteDay(siteId, day) + bags.length + 1;
    return { key, index, label: allocateBagCode(key, day, order), weight: "", wasteTypeId: WASTE_TYPES[0].id };
  };

  const applyRandomCustomer = () => {
    const customer = randomUnverifiedCustomer();
    setHits([customer]);
    setPicked(customer);
    setQuery(customer.phone);
    setError("");
  };

  const choose = (customer: DemoCustomerPick) => {
    setPicked(customer);
    setError("");
  };

  const resetCustomer = () => {
    setPicked(null);
    setHits([]);
    setQuery("");
    setCountText("");
    setBags([]);
    setError("");
  };

  const useCustomerScan = () => {
    setScanning(false);
    applyRandomCustomer();
  };

  const useScaleScan = () => {
    if (!scaleScanKey) return;
    patchBag(scaleScanKey, { weight: String(DEMO_BAG_WEIGHT_KG) });
    setScaleScanKey(null);
  };

  const bagsRef = useRef(bags);
  bagsRef.current = bags;
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const current = bagsRef.current;
      if (countText === "") {
        if (current.length) setBags([]);
        return;
      }
      const total = Number(countText);
      if (!Number.isInteger(total) || total < 0) return;
      if (total === current.length) return;
      if (total < current.length) {
        setBags(current.slice(0, total).map((bag, i) => ({ ...bag, index: i })));
        return;
      }
      const next = [...current];
      for (let i = current.length; i < total; i += 1) next.push(newBag(i));
      setBags(next.map((bag, i) => ({ ...bag, index: i })));
    }, 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countText]);

  const patchBag = (key: string, patch: Partial<BagDraft>) => {
    setBags((current) => current.map((bag) => (bag.key === key ? { ...bag, ...patch } : bag)));
  };

  const removeBag = (key: string) => {
    const next = bags.filter((bag) => bag.key !== key).map((bag, i) => ({ ...bag, index: i }));
    setBags(next);
    setCountText(next.length ? String(next.length) : "");
    setError("");
  };

  const requireCustomer = () => {
    if (!picked) {
      setError("Cari atau scan pengguna dulu.");
      return false;
    }
    return true;
  };

  const totals = useMemo(() => {
    const kg = bags.reduce((sum, b) => sum + (Number(b.weight) > 0 ? Number(b.weight) : 0), 0);
    const { points, cash } = rewardFromKg(kg);
    return { kg, points, cash };
  }, [bags]);

  const finish = () => {
    if (!requireCustomer() || !picked) return;
    if (!bags.length || bags.some((bag) => !(Number(bag.weight) > 0))) {
      setError("Scan timbangan untuk setiap kantong.");
      return;
    }
    const siteName = SITES.find((s) => s.id === siteId)?.name ?? "";
    addStaffDeposit({
      createdAt: new Date().toISOString(),
      siteId,
      siteName,
      customerName: customerDisplayName(picked),
      customerPhone: picked.phone,
      bagCount: bags.length,
      weightKg: totals.kg,
      points: totals.points,
      cash: totals.cash,
      status: "processing",
      bags: bags.map((bag) => ({
        key: bag.key,
        label: bag.label,
        weightKg: Number(bag.weight),
      })),
    });
    router.push("/admin/deposits");
  };


  return (
    <div className="pengumpulan-page">
      <h1 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 700 }}>Pengumpulan setoran</h1>

      <section className="pengumpulan-step">
        <h2 className="pengumpulan-step-title">1. Cari pengguna</h2>
        <div className="pengumpulan-search-stack">
          <input
            className="admin-field-input pengumpulan-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyRandomCustomer()}
            placeholder="Nomor HP"
            aria-label="Nomor HP"
            inputMode="tel"
          />
          <div className="pengumpulan-search-btns">
            <button type="button" className="auth-btn-primary pengumpulan-btn" onClick={applyRandomCustomer}>
              Cari
            </button>
            <button
              type="button"
              className="staff-btn-outline staff-btn-secondary pengumpulan-btn"
              onClick={() => setScanning(true)}
            >
              Scan
            </button>
          </div>
        </div>

      <div style={{ marginTop: 12 }}>
        {picked ? (
          <div className="customer-picked-bar">
            <div className="customer-hit customer-hit--active customer-hit--readonly">
              <span style={{ fontWeight: 700 }}>{customerDisplayName(picked)}</span>
              <span style={{ color: "var(--muted)" }}>{picked.phone}</span>
            </div>
            <button type="button" className="bag-row-btn bag-row-btn--hapus customer-reset-btn" onClick={resetCustomer}>
              Hapus
            </button>
          </div>
        ) : (
          hits.map((customer) => (
            <button
              key={customer.id}
              type="button"
              className="customer-hit"
              onClick={() => choose(customer)}
            >
              <span style={{ fontWeight: 700 }}>{customerDisplayName(customer)}</span>
              <span style={{ color: "var(--muted)" }}>{customer.phone}</span>
            </button>
          ))
        )}
      </div>

      </section>

      <section className="pengumpulan-step">
        <h2 className="pengumpulan-step-title">2. TPS</h2>
        <select
          id="site-tps"
          className="admin-field-input admin-field-input--readonly"
          value={siteId}
          disabled
          aria-label="TPS"
        >
          {SITES.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </section>

      <section className="pengumpulan-step">
        <h2 className="pengumpulan-step-title">3. Masukkan jumlah kantong</h2>
        <input
          id="bag-count"
          className="admin-field-input pengumpulan-count-input"
          inputMode="numeric"
          value={countText}
          aria-label="Jumlah kantong"
          placeholder="Contoh: 2"
          onChange={(e) => (e.target.value === "" || /^\d+$/.test(e.target.value)) && setCountText(e.target.value)}
        />
      </section>

      {bags.length > 0 && (
        <section className="pengumpulan-step">
          <h2 className="pengumpulan-step-title">4. Kantong</h2>
          <div className="reward-preview reward-preview--top">
            <div className="reward-preview-value">
              {totals.kg > 0 ? (
                <RewardSummary kg={totals.kg} points={totals.points} cash={totals.cash} />
              ) : (
                <>
                  <span className="reward-summary-muted">Scan timbangan tiap kantong.</span>
                  <PlasticRateHint />
                </>
              )}
            </div>
          </div>
              <div className="bag-list">
                {bags.map((bag) => {
                  const kg = Number(bag.weight);
                  return (
                    <div key={bag.key} className="bag-row bag-row--oneline">
                      <span className="bag-row-title">{bag.label}</span>
                      <select
                        aria-label={`Jenis ${bag.label}`}
                        className="admin-field-input bag-row-select"
                        value={bag.wasteTypeId}
                        onChange={(e) => patchBag(bag.key, { wasteTypeId: e.target.value })}
                      >
                        {WASTE_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <span className="bag-row-meta">
                        <PlasticRates className="bag-row-rates" />
                        <span className="bag-row-weight">{kg > 0 ? `${kg.toFixed(3)} kg` : "—"}</span>
                      </span>
                      <div className="bag-row-actions">
                        <button
                          type="button"
                          className="bag-row-btn bag-row-btn--scan"
                          onClick={() => setScaleScanKey(bag.key)}
                        >
                          Scan
                        </button>
                        <button type="button" className="bag-row-btn bag-row-btn--hapus" onClick={() => removeBag(bag.key)}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
        </section>
      )}

      <div style={{ marginTop: 24 }}>
        {error && <p style={{ color: "#c62828", margin: "0 0 10px", fontSize: 14 }}>{error}</p>}
        <button type="button" className="auth-btn-primary pengumpulan-btn" style={{ width: "100%" }} onClick={finish}>
          Simpan
        </button>
      </div>

      {scanning && <ScanModal value={DUMMY_CUSTOMER_QR} onClose={() => setScanning(false)} onUse={useCustomerScan} />}
      {scaleScanKey && (
        <ScaleScanModal
          bagLabel={bags.find((b) => b.key === scaleScanKey)?.label ?? ""}
          kg={DEMO_BAG_WEIGHT_KG}
          onClose={() => setScaleScanKey(null)}
          onUse={useScaleScan}
        />
      )}
    </div>
  );
}