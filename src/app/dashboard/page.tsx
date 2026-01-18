import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashboardClient from "@/components/Dashboard/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  return <DashboardClient />;
}
