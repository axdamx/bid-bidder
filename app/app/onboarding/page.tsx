import { Metadata } from "next";
import { OnboardingClient } from "./components/OnboardingClient";

export const metadata: Metadata = {
  title: "Onboarding | Renown",
  description: "Complete your onboarding process",
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
