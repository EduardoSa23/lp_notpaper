import { FaMobileScreenButton } from "react-icons/fa6";

const citizenBadges = ["Alertas em tempo real", "Validacão via QR code"];

export default function SolucoesCidadaniaSection() {
  return (
    <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <img className="w-full rounded-3xl max-h-[275px]" src="/image/servicos_app.jpg" alt="" />
          <img className="w-full rounded-3xl max-h-[275px]" src="/image/mobile_secondary.jpg" alt="" />
        </div>
        <div className="bg-white p-4 rounded-3xl max-w-[270px]">
          <img className="shadow-2xl rounded-3xl" src="/image/tela_app.png" alt="" />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Cidadania digital</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">Governo no bolso do cidadão</h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Aproximamos a gestão pública das pessoas com mobilidade digital. O cidadão solicita serviços, acompanha processos e recebe
          comunicados em tempo real.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {citizenBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              <FaMobileScreenButton />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
