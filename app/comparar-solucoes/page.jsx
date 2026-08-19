import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import ComparativoSection from "@/components/sections/comparacao/comparativo-section/comparativo-section";
import ComparativoSEI from "@/components/sections/comparacao/comparativo-sei-section/comparativo-sei-section";
import ComparacaoCtaFinalSection from "@/components/sections/comparacao/cta-final/cta-final-section"

export const metadata = {
  title: "Comparação | notPaper",
  description: "Veja os diferenciais da notPaper para transformar processos públicos com eficiência.",
  alternates: {
    canonical: "/comparar-solucoes",
  },
};

export default function ComparacaoPage() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-white">
        <ComparativoSection />
        <ComparativoSEI />
        <ComparacaoCtaFinalSection />
      </main>
      <SiteFooter />
    </>
  );
}
