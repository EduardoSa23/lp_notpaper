import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import DiferencaSection from "@/components/sections/diferenca/diferenca-section";
import StatsSection from "@/components/sections/stats/stats-section";

export const metadata = {
  title: "Comparação | notPaper",
  description: "Veja os diferenciais da notPaper para transformar processos públicos com eficiência.",
  alternates: {
    canonical: "/comparacao",
  },
};

export default function ComparacaoPage() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-white">
        <DiferencaSection />
        <StatsSection />
      </main>
      <SiteFooter />
    </>
  );
}
