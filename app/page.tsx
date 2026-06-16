// src/app/page.tsx
// Point d'entree principal - assemblage de toutes les sections dans l'ordre

import Hero from "@/components/sections/Hero";
import Expectations from "@/components/sections/Expectations";
import VideoShowcase from "@/components/sections/VideoShowcase";
import About from "@/components/sections/About";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Theme from "@/components/sections/Theme";
import ChildrenRetreat from "@/components/sections/ChildrenRetreat";
import Schedule from "@/components/sections/Schedule";
import Location from "@/components/sections/Location";
import Registration from "@/components/sections/Registration";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Expectations />
      <VideoShowcase />
      <About />
      <WhoWeAre />
      <Theme />
      <ChildrenRetreat />
      <Schedule />
      <Location />
      <Registration />
      <Contact />
      <Footer />
    </main>
  );
}