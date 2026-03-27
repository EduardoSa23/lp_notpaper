export default function SolucoesHeroSection() {
  return (
    <section className="container mx-auto px-4 pb-12 pt-24 md:pb-16 md:pt-28">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full max-h-[480px] object-cover">
        <source src="/videos/bg_hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-teal-300 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-900">
          Inovação digital
        </span>
        <h1 className="mt-5 max-w-3xl text-3xl text-white font-bold leading-tight md:text-5xl">
          Funcionalidades que redefinem a <span className="text-blue-700">eficiência pública.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white">
          Descubra como a notPaper integra tecnologias de ponta para eliminar burocracia, aumentar produtividade e acelerar a transformação
          digital de ponta a ponta.
        </p>
      </div>
    </section>
  );
}
