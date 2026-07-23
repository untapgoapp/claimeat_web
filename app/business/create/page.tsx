import { redirect } from "next/navigation";

export default function LegacyBusinessCreatePage() {
  redirect("/business/deals/new");
}
