import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import SolucoesHeroSection from "@/components/sections/solucoes/hero-section";
import SolucoesNotpaperSection from "@/components/sections/solucoes/notpaper-section";
import SolucoesGedSection from "@/components/sections/solucoes/ged-section";
import SolucoesWorkflowSection from "@/components/sections/solucoes/workflow-section";
import SolucoesIaBiSection from "@/components/sections/solucoes/ia-bi-section";
import SolucoesCertidoesDocumentosSection from "@/components/sections/solucoes/certidoes-documentos-section";
import SolucoesCidadaniaSection from "@/components/sections/solucoes/cidadania-section";
import SolucoesSobMedidaSection from "@/components/sections/solucoes/sob-medida-section";
import SolucoesCtaFinalSection from "@/components/sections/solucoes/cta-final-section";

export const metadata = {
  title: "Solucoes | notPaper",
  description: "Conheça as solucões da notPaper em GED, automação, IA e experiência digital para gestão pública e privada.",
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
        <SolucoesCertidoesDocumentosSection />
        <SolucoesCidadaniaSection />
        <SolucoesSobMedidaSection />
        <SolucoesCtaFinalSection />
      </main>
      <SiteFooter />
    </>
  );
}
