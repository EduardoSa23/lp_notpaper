import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import QuemSomosHeroSection from "@/components/sections/quem-somos/hero";
import FundamentosValorSection from "@/components/sections/quem-somos/fundamentos";
import QuemSomosCtaSection from "@/components/sections/quem-somos/cta";

export const metadata = {
  title: "Quem Somos | notPaper",
  description: "Conheça a notPaper, nossa missão e experiência em transformação digital para o setor público.",
  alternates: {
    canonical: "/quem-somos",
  },
};

export default function QuemSomosPage() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-[#eceff6]">
        <QuemSomosHeroSection />
        <FundamentosValorSection />
        <QuemSomosCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
