import SiteHeader from "@/components/layout/header";
import SiteFooter from "@/components/layout/footer";
import ContatoSection from "@/components/sections/contato/contato-section";

export const metadata = {
  title: "Contato | notPaper",
  description: "Fale com a equipe da notPaper e descubra a melhor solução para a sua gestão.",
  alternates: {
    canonical: "/contato",
  },
};

export default function ContatoPage() {
  return (
    <>
      <SiteHeader />
      <main className="font-inter bg-white">
        <ContatoSection />
      </main>
      <SiteFooter />
    </>
  );
}
