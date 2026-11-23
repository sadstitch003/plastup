import Image from "next/image";

export function PointsBalanceCard({ points }: { points: number }) {
  return (
    <div className="portal-card points-balance-card">
      <div className="points-balance-card__inner">
        <div className="points-balance-card__copy">
          <p className="points-balance-card__label">Poin saya</p>
          <p className="points-balance-card__value">{points.toLocaleString("id-ID")}</p>
        </div>
        <div className="points-balance-card__art" aria-hidden>
          <Image
            src="/mascot/semangat.webp"
            alt=""
            width={96}
            height={96}
            className="points-balance-card__mascot"
            priority
          />
        </div>
      </div>
    </div>
  );
}