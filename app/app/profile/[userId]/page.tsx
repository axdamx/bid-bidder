import { Metadata } from "next";
import { ProfileClient } from "./components/ProfileClient";
import { ProfilePageProps } from "./types";

export const metadata: Metadata = {
  title: "User Profile | Renown",
  description: "View user profile, listings, and reviews",
};

export default function ProfilePage(props: ProfilePageProps) {
  return (
    <div className="container mx-auto py-8">
      <ProfileClient params={props.params} />
    </div>
  );
}
