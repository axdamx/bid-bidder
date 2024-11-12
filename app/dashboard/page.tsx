// app/dashboard/page.tsx

import { getUserById } from "../action";
import { getUserData } from "./action";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage() {
  const { user, error } = await getUserData();
  const initialUser = await getUserById(user?.id || "");

  return <DashboardClient initialUser={initialUser} />;
}
