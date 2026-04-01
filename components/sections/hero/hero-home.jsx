import Image from "next/image";
import Link from "next/link";
import { FaRocket, FaLightbulb } from "react-icons/fa6";

const heroData = {
  title: "Gestão pública",
  titleHighlight: "Digital de verdade.",
  description: "Automatize processos, elimine o papel e tenha controle total da sua prefeitura em um só sistema.",
  heroImage: "/image/secaoHero.png",
  heroImageAlt: "Profissional trabalhando",
};

export default function HeroHome() {
  return (
    <section id="home" className="pb-16 pt-20 lg:pt-32 section-anchor">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full lg:max-h-[626px] object-cover">
        <source src="/videos/bg_hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <div className="container mx-auto px-4">
        <div className="md:grid items-center lg:grid-cols-[auto_auto] md:justify-between">
          <div className="animate-fade-in-up lg:max-w-[700px]">
            <h1 className="mb-6 text-center text-3xl font-bold text-white md:text-left md:text-5xl">
              {heroData.title} <span className="text-[#0043FE]">{heroData.titleHighlight}</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-white">{heroData.description}</p>
            <div className="flex justify-between gap-4 sm:flex-row md:justify-start">
              <Link
                href="https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F"
                target="_blank"
                className="rounded-lg text-center bg-[#0043FE] px-4 md:px-8 py-2 md:py-4 font-semibold text-white transition-colors hover:bg-[#0135c5] md:text-lg"
              >
                Transformar minha gestão
              </Link>
              <Link href="/solucoes">
                <button className="rounded-lg text-center border-2 border-gray-300 px-4 md:px-8 py-2 md:py-4 font-semibold text-white transition-colors hover:border-[#ccc] hover:text-[#ccc] md:text-lg">
                  Conhecer nossa solução
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-12 animate-zoom-in lg:mt-0">
            <img
              src={heroData.heroImage}
              alt={heroData.heroImageAlt}
              className="relative h-auto w-full max-w-[640px] rounded-2xl shadow-2xl"
            />
            <div className="absolute -right-2 -top-4 flex animate-bounce items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 font-bold text-black [animation-duration:1.2s] md:-right-4">
              <FaLightbulb />
              <span>Inovação</span>
            </div>
            <div className="absolute -bottom-4 -left-2 flex animate-bounce items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white [animation-delay:0.35s] [animation-duration:1.3s] md:-left-4">
              <FaRocket />
              <span>Resultado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
