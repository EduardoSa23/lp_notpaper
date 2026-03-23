import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import SobreSection from "@/components/sections/sobre/sobre-section";
import ClientesSection from "@/components/sections/clientes/clientes-section";

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
      <main className="font-inter bg-white">
        <SobreSection />
        <ClientesSection />
      </main>
      <SiteFooter />
    </>
  );
}
