import Link from "next/link";
import BorderGlow from "../../animate/Components/BorderGlow/BorderGlow";

export default function SolucoesCtaFinalSection() {
  return (
    <section className="container mx-auto px-4 pb-16 pt-6 md:pb-20">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="30 58 138"
        backgroundColor="#060010"
        borderRadius={25}
        glowRadius={40}
        glowIntensity={5}
        coneSpread={25}
        animated={false}
        colors={["#02010f", "#1d1250", "#101baf"]}
      >
        <div className="rounded-3xl bg-[#253143] p-6 text-center shadow-sm md:p-8">
          <h3 className="text-3xl font-bold text-white md:text-4xl">Sua prefeitura está pronta para avançar sem burocracia?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-gray-200">
            Transforme processos lentos em uma gestão ágil, digital e eficiente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F"
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-800"
            >
              Agendar demonstração
            </Link>
            <Link
              href="/comparar-solucoes"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700"
            >
              Ver por que a NotPaper é diferente
            </Link>
          </div>
        </div>
      </BorderGlow>
    </section>
  );
}
