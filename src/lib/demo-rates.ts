/** Tarif demo plastik (per kg). */
export const DEMO_PLASTIC_POINTS_PER_KG = 10;
export const DEMO_PLASTIC_CASH_PER_KG = 3500;

export function rewardFromKg(kg: number) {
  if (!(kg > 0)) return { points: 0, cash: 0 };
  return {
    points: Math.max(1, Math.round(kg * DEMO_PLASTIC_POINTS_PER_KG)),
    cash: Math.round(kg * DEMO_PLASTIC_CASH_PER_KG),
  };
}

export function formatRewardPreview(points: number, cash: number) {
  if (points <= 0 && cash <= 0) return "—";
  return `+${points.toLocaleString("id-ID")} poin · Rp ${cash.toLocaleString("id-ID")}`;
}

export function plasticRateParts() {
  return {
    points: `${DEMO_PLASTIC_POINTS_PER_KG} poin/kg`,
    cash: `Rp ${DEMO_PLASTIC_CASH_PER_KG.toLocaleString("id-ID")}/kg`,
  };
}