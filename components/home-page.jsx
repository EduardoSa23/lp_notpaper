import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import StructuredData from "@/components/seo/structured-data";
import HeroSection from "@/components/sections/hero/hero-section";
import DiferencaSection from "@/components/sections/diferenca/diferenca-section";
import ServicosSection from "@/components/sections/servicos/servicos";
import ClientesSection from "@/components/sections/clientes/clientes-section";
import SobreSection from "@/components/sections/sobre/sobre-section";
import StatsSection from "@/components/sections/stats/stats-section";
import ContatoSection from "@/components/sections/contato/contato-section";

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <SiteHeader />

      <main className="font-inter bg-white">
        <HeroSection />
        <DiferencaSection />
        <ServicosSection />
        <ClientesSection />
        <SobreSection />
        <StatsSection />
        <ContatoSection />
      </main>

      <SiteFooter />
    </>
  );
}
