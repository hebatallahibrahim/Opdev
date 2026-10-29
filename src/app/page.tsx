import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import Chapters from "@/components/Chapters";
import BusinessLines from "@/components/BusinessLines";
import WhyOpDev from "@/components/WhyOpDev";
import Industries from "@/components/Industries";
import SelectedWork from "@/components/SelectedWork";
import Insights from "@/components/Insights";
import FinalCta from "@/components/FinalCta";
import SceneLayer from "@/components/gl/SceneLayer";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <SceneLayer />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Chapters />
        {/* Light "sheet" that covers the 3D scene; the scene pauses while it fills the screen. */}
        <div id="sheet">
          <BusinessLines />
          <WhyOpDev />
          <Industries />
          <SelectedWork />
          <Insights />
        </div>
        <FinalCta />
      </main>
    </>
  );
}
