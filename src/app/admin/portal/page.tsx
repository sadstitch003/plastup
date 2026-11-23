import { redirect } from "next/navigation";

export default function LegacyAdminPortal() {
  redirect("/admin/dashboard");
}