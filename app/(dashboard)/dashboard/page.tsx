import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__hcsession")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) redirect("/login");
  redirect(`/dashboard/${payload.role}`);
}
