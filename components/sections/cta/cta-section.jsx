import Link from "next/link";
import SplitText from "../../animate/TextAnimations/SplitText/SplitText";
import BorderGlow from "../../animate/Components/BorderGlow/BorderGlow";

export default function CtaFinalSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 pb-6 md:pb-20 md:pb-24">
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
        <div className="rounded-3xl bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)] p-6 text-center md:py-10">
          <SplitText
            text="Antes de escolher um sistema, veja isso"
            className="mx-auto max-w-[800px] text-3xl font-bold text-white md:text-5xl"
            delay={50}
            duration={1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />

          <p className="mx-auto mt-3 max-w-3xl text-gray-200 md:mt-8">
            Nem toda solução entrega o que promete. Compare a NotPaper com outras plataformas e entenda as diferenças que impactam sua
            gestão em funcionalidades, controle, rastreabilidade e eficiência, antes de tomar uma decisão.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-8">
            <Link
              href="/comparacao"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-slate-700 transition-colors hover:border-blue-700 hover:text-blue-700 md:text-lg"
            >
              Comparar com outros sistemas
            </Link>
          </div>
        </div>
      </BorderGlow>
    </section>
  );
}
