import Image from "next/image";
import { FaRocket, FaLightbulb } from "react-icons/fa6";

const heroData = {
  title: "Gestão pública",
  titleHighlight: "Inteligente.",
  description: "Oferecemos tecnologia inovadora. Automatizamos e agilizamos os seus processos com sustentabilidade e eficiência.",
  ctaWhatsapp: "https://api.whatsapp.com/send?phone=5511941398031&text=Olá",
  heroImage: "/image/secaoHero.png",
  heroImageAlt: "Profissional trabalhando",
};

export default function HeroHome() {
  return (
    <section id="home" className="pb-16 pt-20 lg:pt-32 section-anchor">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full max-h-[626px] object-cover">
        <source src="/videos/bg_hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <div className="container mx-auto px-4">
        <div className="md:grid items-center lg:grid-cols-[auto_auto] md:justify-between">
          <div className="animate-fade-in-up lg:max-w-[700px]">
            <h1 className="mb-6 text-center text-4xl font-bold text-white md:text-left md:text-6xl">
              {heroData.title} <span className="text-[#0043FE]">{heroData.titleHighlight}</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-white">{heroData.description}</p>
            <div className="flex justify-between gap-4 sm:flex-row md:justify-start">
              <a href={heroData.ctaWhatsapp} target="_blank" rel="noreferrer">
                <button className="rounded-lg bg-[#0043FE] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#0135c5] md:text-lg">
                  Começar Agora
                </button>
              </a>
              <a href="#contato">
                <button className="rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-white transition-colors hover:border-[#0043FE] hover:text-[#0043FE] md:text-lg">
                  Saiba mais
                </button>
              </a>
            </div>
          </div>

          <div className="mt-12 animate-zoom-in lg:mt-0">
            <Image src={heroData.heroImage} alt={heroData.heroImageAlt} width={640} height={500} className="rounded-2xl shadow-2xl relative" priority />
            <div className="absolute -right-2 -top-4 flex animate-bounce items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 font-bold text-black [animation-duration:1.8s] md:-right-4">
              <FaLightbulb />
              <span>Inovação</span>
            </div>
            <div className="absolute -bottom-4 -left-2 flex animate-bounce items-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white [animation-delay:0.35s] [animation-duration:1.9s] md:-left-4">
              <FaRocket />
              <span>Resultado</span>
            </div>
          </div>
        </div>
      </div>

      <a href={heroData.ctaWhatsapp} target="_blank" rel="noreferrer">
        <Image
          src="/image/whatsapp.png"
          alt="Botão de WhatsApp"
          width={64}
          height={64}
          className="fixed bottom-8 right-2 z-50 h-auto w-16 cursor-pointer transition-transform duration-300 hover:scale-110 md:right-8"
        />
      </a>
    </section>
  );
}
