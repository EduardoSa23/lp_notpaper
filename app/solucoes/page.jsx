import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import SolucoesHeroSection from "@/components/sections/solucoes/hero-section";
import SolucoesNotpaperSection from "@/components/sections/solucoes/notpaper-section";
import SolucoesGedSection from "@/components/sections/solucoes/ged-section";
import SolucoesWorkflowSection from "@/components/sections/solucoes/workflow-section";
import SolucoesIaBiSection from "@/components/sections/solucoes/ia-bi-section";
import SolucoesCidadaniaSection from "@/components/sections/solucoes/cidadania-section";
import SolucoesSobMedidaSection from "@/components/sections/solucoes/sob-medida-section";
import SolucoesCtaFinalSection from "@/components/sections/solucoes/cta-final-section";

export const metadata = {
  title: "Solucoes | notPaper",
  description: "Conheca as solucoes da notPaper em GED, automacao, IA e experiencia digital para gestao publica e privada.",
  alternates: {
    canonical: "/solucoes",
  },
};

export default function PageSolucoes() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6] text-slate-900">
        <SolucoesHeroSection />
        <SolucoesNotpaperSection />
        <SolucoesWorkflowSection />
        <SolucoesGedSection />
        <SolucoesIaBiSection />
        <SolucoesCidadaniaSection />
        <SolucoesSobMedidaSection />
        <SolucoesCtaFinalSection />
      </main>
      <SiteFooter />
    </>
  );
}
