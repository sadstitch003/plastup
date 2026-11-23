"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { BRAND_LINE } from "@/config/brand";

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  group?: string;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
};

export function AppShell({
  items,
  footer,
  brandHref = "/portal/menu",
  children,
}: {
  items: NavItem[];
  footer?: ReactNode;
  brandHref?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const activeHref = useMemo(() => {
    const matches = items
      .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
      .sort((a, b) => b.href.length - a.href.length);
    return matches[0]?.href;
  }, [items, pathname]);

  const filterItems = (desktop: boolean) => {
    const q = desktop ? query.trim().toLowerCase() : "";
    return items.filter((item) => {
      if (desktop ? item.mobileOnly : item.desktopOnly) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || (item.group ?? "").toLowerCase().includes(q);
    });
  };

  const renderLinks = (vertical: boolean) => {
    const list = filterItems(vertical);
    let lastGroup = "";
    return list.map((item) => {
      const active = item.href === activeHref;
      const link = (
        <Link
          key={item.href}
          href={item.href}
          className={`app-nav-link${active ? " app-nav-link--active" : ""}${vertical ? " app-nav-link--side" : " app-nav-link--tab"}`}
        >
          <span className="app-nav-icon">{item.icon}</span>
          <span className="app-nav-label">{item.label}</span>
        </Link>
      );
      const showGroup = vertical && item.group && item.group !== lastGroup;
      if (vertical) lastGroup = item.group ?? "";
      if (!showGroup) return link;
      return (
        <div key={item.href} className="app-nav-group-wrap">
          <div className="app-nav-group">{item.group}</div>
          {link}
        </div>
      );
    });
  };

  const brand = (
    <Link href={brandHref} className="app-brand">
      <Image src="/brand/logo.png" alt="" width={40} height={40} style={{ borderRadius: 8, flexShrink: 0 }} />
      <span className="app-brand-text">{BRAND_LINE}</span>
    </Link>
  );

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        {brand}
        <input
          className="app-menu-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari menu"
          aria-label="Cari menu"
        />
        <nav className="app-sidebar-nav">{renderLinks(true)}</nav>
        {footer ? <div className="app-sidebar-footer">{footer}</div> : null}
      </aside>

      <div className="app-main">
        <div className="app-mobile-brand">{brand}</div>
        <div className="app-main-inner">{children}</div>
      </div>

      <nav className="app-tabbar" aria-label="Menu utama">
        {renderLinks(false)}
      </nav>
    </div>
  );
}