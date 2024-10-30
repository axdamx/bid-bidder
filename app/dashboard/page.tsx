// app/dashboard/page.tsx

import { getUserData } from "./action";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage() {
  const { user, error } = await getUserData();
  if (!user) {
    return null;
  }

  return <DashboardClient initialUser={user} />;
}
