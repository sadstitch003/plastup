import { DEMO_STAFF_SITE_ID } from "@/config/demo";
import { DEMO_SITES } from "@/lib/demo-dashboard";

export const staffDemoSite = () => DEMO_SITES.find((s) => s.id === DEMO_STAFF_SITE_ID) ?? DEMO_SITES[0];