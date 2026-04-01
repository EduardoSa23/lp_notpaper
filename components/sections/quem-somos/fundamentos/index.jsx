import { FaBullseye, FaDiagramProject, FaEye } from "react-icons/fa6";

const fundamentos = [
  {
    icon: FaBullseye,
    title: "Missão",
    description: "Agregar valor e gerar novas tecnologias que potencializam marcas em toda a cadeia logística, do hardware ao workflow.",
  },
  {
    icon: FaEye,
    title: "Visão",
    description: "Criar soluções tecnologicas e economicas que fortalecam o crescimento dos nossos clientes como parceiros digitais de longo prazo.",
  },
  {
    icon: FaDiagramProject,
    title: "Valores",
    description: "Nossos pilares fundamentais para construir relações consistentes e sustentaveis, baseadas em confiança e colaboração.",
    tags: ["Comunicação", "Parceria", "Respeito"],
  },
];

export default function FundamentosValorSection() {
  return (
    <section className="bg-[#e9edf7] py-20">
      <div className="mx-auto w-full max-w-[1280px] px-4">
        <header className="mx-auto max-w-[768px] text-center">
          <h2 className="text-[2.35rem] font-bold text-slate-900 lg:text-[3.4rem]">
            Fundamentos de <span className="text-[#0043fe]">Valor</span>
          </h2>
          <p className="mt-4 text-[1.07rem] leading-[1.65rem] text-slate-600">
            Construímos o futuro sobre pilares sólidos de tecnologia, proximidade e compromisso humano.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fundamentos.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[1.25rem] bg-slate-50 p-7 shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(15,23,42,0.12)] md:p-8"
              >
                <div className="inline-flex rounded-[0.9rem] bg-gradient-to-br from-blue-100 to-teal-200 p-[0.85rem]">
                  <Icon className="text-[1.4rem] text-slate-800" />
                </div>
                <h3 className="mt-5 text-[2rem] font-bold text-slate-900">{item.title}</h3>

                {item.tags ? (
                  <div className="mt-[0.9rem] flex flex-wrap gap-[0.45rem]">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-100 px-[0.62rem] py-[0.18rem] text-[0.7rem] font-bold tracking-[0.08em] text-blue-900">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="mt-5 text-[1.07rem] leading-7 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
