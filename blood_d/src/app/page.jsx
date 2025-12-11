import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CurrentNeeds from "@/components/CurrentNeeds";
import Features from "@/components/Features";
import WhoNeeds from "@/components/WhoNeeds";
import HowItWorks from "@/components/HowItWorks";
import Eligibility from "@/components/Eligibility";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <CurrentNeeds />
      <Features />
      <WhoNeeds />
      <HowItWorks />
      <Eligibility />
      <Footer />
    </main>
  );
}
