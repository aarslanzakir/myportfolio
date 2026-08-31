import Contact from "@/components/Contact";
import Engagement from "@/components/Engagement";
import EstimatorSection from "@/components/EstimatorSection";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import WhyMe from "@/components/WhyMe";
import { buildJsonLd, serializeJsonLd } from "@/lib/seo";
import { listProjects } from "@/lib/store";

export default async function Home() {
  /* Structured data lives on the public page rather than the root
     layout so /admin never emits it, and so the portfolio ItemList
     reflects whatever is actually in the store. */
  const jsonLd = buildJsonLd(await listProjects());

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Hero />
      <Services />
      <Projects />
      <Skills />
      <Process />
      <EstimatorSection />
      <Engagement />
      <WhyMe />
      <Faq />
      <Contact />
    </main>
  );
}
