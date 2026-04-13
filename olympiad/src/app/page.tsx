import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Subjects from "@/components/Subjects";
import AwardsAndFees from "@/components/AwardsAndFees";
import StudyMaterial from "@/components/StudyMaterial";
import RegistrationBanner from "@/components/RegistrationBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <WhyChooseUs />
      <Subjects />
      <AwardsAndFees />
      <StudyMaterial />
      <RegistrationBanner />
      <Footer />
    </main>
  );
}
