// app/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { getUserById } from "../action";
import { useSupabase } from "../context/SupabaseContext";
import { getUserData } from "./action";
import DashboardClient from "./dashboardClient";
import { SkeletonLoading } from "./components/DashboadSkeletonLoader";

// export default async function DashboardPage() {
//   const { user, error } = await getUserData();
//   console.log("users in dashboard", user);
//   const initialUser = await getUserById(user?.id || "");

//   return <DashboardClient initialUser={initialUser} />;
// }
export default function DashboardPage() {
  const { session } = useSupabase(); // Use the hook to get session data
  const userId = session?.user?.id || ""; // Extract user ID from session

  const [initialUser, setInitialUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const fetchedUser = await getUserById(userId);
        setInitialUser(fetchedUser);
      } catch (err) {
        setError(err);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!initialUser) {
    return <SkeletonLoading />;
  }

  return <DashboardClient initialUser={initialUser} />;
}
