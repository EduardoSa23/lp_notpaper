import { FaBrain, FaBuildingColumns } from "react-icons/fa6";
import RotatingText from "../../animate/TextAnimations/RotatingText/RotatingText";

const customSolutions = [
  {
    icon: FaBuildingColumns,
    title: "Setor Público e Prefeituras",
    text: "Foco em transparência ativa, atendimento ao cidadão e gestão integrada de serviços essênciais.",
    bullets: ["Portal da transparência integrado", "Tramitação legislativa digital"],
  },
  {
    icon: FaBrain,
    title: "Iniciativa Privada",
    text: "Automatização de contratos, compliance e governança de fluxos empresariais em escala.",
    bullets: ["Assinatura de contratos em lote", "Prontuário digital de colaboradores"],
  },
];

export default function SolucoesSobMedidaSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="relative rounded-[2rem] p-6 md:p-10 shadow-lg">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover rounded-[2rem]">
          <source src="/videos/bg_recursos_poderosos.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 -z-10" />

        <div className="relative">
          <header className="mx-auto max-w-3xl text-white text-center">
            <h2 className="flex flex-col md:flex-row items-center justify-center gap-4 text-4xl font-bold leading-tight md:text-5xl">Soluções 
              <RotatingText
              texts={["Sob medida", "Escaláveis", "Modernas", "Digitais"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-[#0348FC] text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
              
              </h2>
            <p className="mt-4 text-lg">
              Desenvolvemos módulos específicos para atender as necessidades de cada setor com segurança e agilidade.
            </p>
          </header>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {customSolutions.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.text}</p>

                  <ul className="mt-5 space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-teal-400" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
