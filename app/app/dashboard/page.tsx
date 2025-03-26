"use client";

import DashboardClient from "./dashboardClient";
import { SkeletonLoading } from "./components/DashboadSkeletonLoader";
import { useAtom } from "jotai";
import { userAtom } from "@/app/atom/userAtom";

export default function DashboardPage() {
  const [user] = useAtom(userAtom);

  if (!user) {
    return <SkeletonLoading />;
  }

  return <DashboardClient initialUser={user} />;
}
