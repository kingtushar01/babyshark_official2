import AboutUs from "@/components/Homepage/AboutUs";
import FAQ from "@/components/Homepage/FAQ";
import HeroSection from "@/components/Homepage/HeroSection";
import OurServices from "@/components/Homepage/OurServices";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <OurServices />
      <FAQ />
    </>
  );
}
