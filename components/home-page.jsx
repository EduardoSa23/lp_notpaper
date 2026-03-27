import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import StructuredData from "@/components/seo/structured-data";
import HeroHome from "@/components/sections/hero/hero-home";
import DiferencaSection from "@/components/sections/diferenca/diferenca-section";
import RecursosPoderosos from "@/components/sections/recursos-poderosos/index";
import ClientesSection from "@/components/sections/clientes/clientes-section";
import StatsSection from "@/components/sections/stats/stats-section";
import ContatoSection from "@/components/sections/contato/contato-section";
import CtaFinalSection from "@/components/sections/cta/cta-section"

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <SiteHeader />

      <main className="font-inter bg-white">
        <HeroHome />
        <DiferencaSection />
        <CtaFinalSection />
        <RecursosPoderosos />
        <ClientesSection />
        <StatsSection />
        <ContatoSection />
      </main>

      <SiteFooter />
    </>
  );
}
