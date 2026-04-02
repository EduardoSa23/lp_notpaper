import Image from "next/image";
import Link from "next/link";
import { FaRocket, FaLightbulb } from "react-icons/fa6";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const heroData = {
  title: "Gestão pública",
  titleHighlight: "Digital de verdade.",
  description: "Automatize processos, elimine o papel e tenha controle total da sua prefeitura em um só sistema.",
  heroImage: "/image/secaoHero.png",
  heroImageAlt: "Profissional trabalhando",
};

export default function HeroHome() {
  return (
    <section id="home" className="section-anchor pb-16 pt-20 lg:pt-32">
      <video autoPlay loop muted playsInline aria-hidden="true" tabIndex={-1} className="absolute inset-0 w-full h-full max-h-[780px] lg:max-h-[626px] object-cover">
        <source src="/videos/bg_hero.mp4" type="video/mp4" />
        <track src="/videos/decorative-captions.vtt" kind="captions" srcLang="pt-BR" label="Português" />
      </video>
      <div className="absolute inset-0 -z-10 bg-black/60" />
      <div className="container mx-auto px-4">
        <div className="items-center md:grid md:justify-between lg:grid-cols-[auto_auto]">
          <div className="animate-fade-in-up lg:max-w-[700px]">
            <h1 className="mb-6 text-center text-3xl font-bold text-white md:text-left md:text-5xl">
              {heroData.title} <span className="text-[#5a7ef2]">{heroData.titleHighlight}</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-white">{heroData.description}</p>
            <div className="flex justify-between gap-4 sm:flex-row md:justify-start">
              <Link
                href="https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F"
                target="_blank"
                className="rounded-lg bg-[#0043FE] px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-[#0135c5] md:px-8 md:py-4 md:text-lg"
              >
                Transformar minha gestão
              </Link>
              <Link
                href="/solucoes"
                className="rounded-lg border-2 border-white px-4 py-2 text-center font-semibold text-white transition-colors hover:border-[#dbe6ff] hover:text-[#dbe6ff] md:px-8 md:py-4 md:text-lg"
              >
                Conhecer nossa solução
              </Link>
            </div>
          </div>

          <div className="mt-12 animate-zoom-in lg:mt-0">
            <Image
              src={heroData.heroImage}
              alt={heroData.heroImageAlt}
              width={640}
              height={550}
              className="relative md:max-w-[640px] max-w-[340px] rounded-2xl shadow-2xl"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute -right-2 -top-4 flex animate-bounce items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 font-bold text-black [animation-duration:1.2s] md:-right-4">
              <FaLightbulb aria-hidden="true" />
              <span>Inovação</span>
            </div>
            <div className="absolute -bottom-4 -left-2 flex animate-bounce items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white [animation-delay:0.35s] [animation-duration:1.3s] md:-left-4">
              <FaRocket aria-hidden="true" />
              <span>Resultado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
