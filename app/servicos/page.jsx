import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import ServicosSection from "@/components/sections/servicos/servicos";

export const metadata = {
  title: "Serviços | notPaper",
  description: "Conheça os serviços da notPaper em GED, automação e soluções digitais para sua cidade.",
  alternates: {
    canonical: "/servicos",
  },
};

export default function ServicosPage() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-white">
        <ServicosSection />
      </main>
      <SiteFooter />
    </>
  );
}
