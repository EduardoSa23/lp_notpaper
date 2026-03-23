import Image from "next/image";

const heroData = {
  title: "Gestão pública",
  titleHighlight: "Inteligente.",
  description: "Oferecemos tecnologia inovadora. Automatizamos e agilizamos os seus processos com sustentabilidade e eficiência.",
  ctaWhatsapp: "https://api.whatsapp.com/send?phone=5511941398031&text=Olá",
  heroImage: "/image/secaoHero.png",
  heroImageAlt: "Profissional trabalhando",
};

export default function HeroSection() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-[#d3dbf1] pb-16 pt-20 section-anchor">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-in-up">
            <h1 className="mb-6 text-center text-4xl font-bold text-gray-900 md:text-left md:text-6xl">
              {heroData.title} <span className="text-[#0043FE]">{heroData.titleHighlight}</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-600">{heroData.description}</p>
            <div className="flex justify-between gap-4 sm:flex-row md:justify-start">
              <a href={heroData.ctaWhatsapp} target="_blank" rel="noreferrer">
                <button className="rounded-lg bg-[#0043FE] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#0135c5] md:text-lg">
                  Começar Agora
                </button>
              </a>
              <a href="#contato">
                <button className="rounded-lg border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-colors hover:border-[#0043FE] hover:text-[#0043FE] md:text-lg">
                  Saiba mais
                </button>
              </a>
            </div>
          </div>

          <div className="relative mt-12 animate-zoom-in md:mt-0">
            <Image src={heroData.heroImage} alt={heroData.heroImageAlt} width={640} height={500} className="rounded-2xl shadow-2xl" priority />
            <div className="absolute -right-2 -top-4 rounded-full bg-yellow-400 px-4 py-2 font-bold text-black md:-right-4">Inovação</div>
            <div className="absolute -bottom-4 -left-2 rounded-full bg-blue-500 px-4 py-2 font-bold text-white md:-left-4">Resultados</div>
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
