import { FaDiagramProject, FaWaveSquare } from "react-icons/fa6";

const workflowFeatures = [
  {
    icon: FaDiagramProject,
    title: "Modelagem visual",
    text: "Estruture processos e aprovações com lógica clara e sem gargalos.",
  },
  {
    icon: FaWaveSquare,
    title: "Tracking de eficiência",
    text: "Monitore tempos, status e metas para reduzir retrabalho contínuo.",
  },
];

export default function SolucoesWorkflowSection() {
  return (
    <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-16">
      <div className="p-4 shadow-xl bg-white rounded-2xl">
        <img className="rounded-2xl" src="/image/automacao.png" alt="" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Módulo 02</p>
        <h2 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">Automação & Workflow (BPMN 2.0)</h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Modele processos complexos com facilidade visual. Transforme fluxos manuais em sequências digitais seguras, sem erros e com
          aprovações rastreaveis.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {workflowFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
