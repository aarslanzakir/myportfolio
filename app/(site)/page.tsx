import Contact from "@/components/Contact";
import Engagement from "@/components/Engagement";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import WhyMe from "@/components/WhyMe";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <Projects />
      <Skills />
      <Process />
      <Engagement />
      <WhyMe />
      <Faq />
      <Contact />
    </main>
  );
}
