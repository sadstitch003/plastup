import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function MenuTile({
  label,
  href,
  onClick,
  icon,
  assetSrc,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  assetSrc?: string;
}) {
  const inner = (
    <>
      <div className="menu-tile-icon">
        {assetSrc ? (
          <Image src={assetSrc} alt="" width={28} height={28} style={{ objectFit: "contain" }} />
        ) : (
          icon
        )}
      </div>
      <div className="menu-tile-label">{label}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="menu-tile">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className="menu-tile" onClick={onClick}>
      {inner}
    </button>
  );
}