import { plasticRateParts } from "@/lib/demo-rates";

export function PlasticRates({ className }: { className?: string }) {
  const { points, cash } = plasticRateParts();
  return (
    <span className={className ? `plastic-rates ${className}` : "plastic-rates"}>
      <span>{points}</span>
      <span>{cash}</span>
    </span>
  );
}

export function RewardSummary({ kg, points, cash }: { kg: number; points: number; cash: number }) {
  if (!(kg > 0)) return null;
  return (
    <div className="deposit-totals deposit-totals--compact">
      <div className="deposit-totals-weight-row">
        <PlasticRates className="deposit-totals-rates" />
        <span className="deposit-totals-value deposit-totals-value--weight">{kg.toFixed(3)} kg</span>
      </div>
      <div className="deposit-totals-split">
        <div className="deposit-totals-col">
          <span className="deposit-totals-label">Harga</span>
          <span className="deposit-totals-value deposit-totals-value--cash">Rp {cash.toLocaleString("id-ID")}</span>
        </div>
        <div className="deposit-totals-col">
          <span className="deposit-totals-label">Poin</span>
          <span className="deposit-totals-value deposit-totals-value--points">+{points.toLocaleString("id-ID")} poin</span>
        </div>
      </div>
    </div>
  );
}

export function PlasticRateHint() {
  return <PlasticRates className="deposit-totals-rates deposit-totals-rates--solo" />;
}

export function RewardPills({ points, cash }: { points: number; cash: number }) {
  if (points <= 0 && cash <= 0) return <span className="reward-summary-muted">—</span>;
  return (
    <div className="reward-summary-row reward-summary-row--inline">
      <span className="reward-summary-pill reward-summary-pill--points">+{points.toLocaleString("id-ID")} poin</span>
      <span className="reward-summary-pill reward-summary-pill--cash">Rp {cash.toLocaleString("id-ID")}</span>
    </div>
  );
}