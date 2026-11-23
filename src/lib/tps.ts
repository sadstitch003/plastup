import { TPS_SITE_NAMES } from "@/config/tps-sites";

export type SiteRow = { id: number; name: string };

export function getTpsSites(): SiteRow[] {
  return TPS_SITE_NAMES.map((name, index) => ({ id: index + 1, name }));
}