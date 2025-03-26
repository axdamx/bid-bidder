// export { default } from "./(landing)/page";

import LandingPage from "./home/components/sections/LandingPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
