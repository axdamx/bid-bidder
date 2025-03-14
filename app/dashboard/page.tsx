"use client";

import DashboardClient from "./dashboardClient";
import { SkeletonLoading } from "./components/DashboadSkeletonLoader";
import { userAtom } from "../atom/userAtom";
import { useAtom } from "jotai";

export default function DashboardPage() {
  const [user] = useAtom(userAtom);

  if (!user) {
    return <SkeletonLoading />;
  }

  return <DashboardClient initialUser={user} />;
}
