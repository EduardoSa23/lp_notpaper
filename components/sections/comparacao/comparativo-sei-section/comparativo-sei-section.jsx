"use client";

import { FaCheck, FaTimes } from "react-icons/fa";
import { MdWarning } from "react-icons/md";

const rows = [
  {
    category: "Posicionamento",
    notpaper:
      "Plataforma integrada de transformação digital pública com GED/ECM, workflow BPMN, assinatura, OCR, IA e app cidadão.",
    sei:
      "Solução oficial de PEN para produção, tramitação, uso e acesso a documentos e processos administrativos eletrônicos.",
    level: "success",
  },
  {
    category: "Processo administrativo eletrônico",
    notpaper:
      "Atende com protocolo digital, tramitação, auditoria e automação processual.",
    sei:
      "É exatamente o núcleo funcional do SEI: processo e documento administrativo eletrônico.",
    level: "success",
  },
  {
    category: "Digitalização do legado",
    notpaper:
      "Digitalização jurídica estruturada como parte central da solução.",
    sei:
      "Permite inserção de documentos digitalizados, mas sem operação ponta a ponta.",
    level: "warning",
  },
  {
    category: "OCR / pesquisa",
    notpaper:
      "OCR nativo com indexação e busca inteligente no ecossistema.",
    sei:
      "OCR básico em PDF, sem evidência de pipeline completo.",
    level: "warning",
  },
  {
    category: "Workflow BPMN",
    notpaper:
      "Workflow e BPMN como núcleo de automação e adaptação.",
    sei:
      "Não há evidência de designer BPMN nativo.",
    level: "danger",
  },
  {
    category: "Assinatura digital",
    notpaper:
      "Assinatura integrada ao ecossistema da plataforma.",
    sei:
      "Assinatura via login/senha ou certificado.",
    level: "success",
  },
  {
    category: "IA integrada",
    notpaper:
      "IA aplicada para classificação, análise e apoio à decisão.",
    sei:
      "Sem evidência de IA embarcada.",
    level: "danger",
  },
  {
    category: "App cidadão",
    notpaper:
      "App com serviços, comunicação e interação com população.",
    sei:
      "Não possui app com esse escopo.",
    level: "danger",
  },
  {
    category: "Customização por workflow",
    notpaper:
      "Plataforma adaptável com workflow gráfico.",
    sei:
      "Customização limitada a formulários.",
    level: "warning",
  },
];

function StatusIcon({ level }) {
  const styles = {
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-500",
  };

  const icons = {
    success: <FaCheck />,
    warning: <MdWarning />,
    danger: <FaTimes />,
  };

  return (
    <span className={`text-lg ${styles[level]} flex justify-center`}>
      {icons[level]}
    </span>
  );
}

export default function ComparativoSEISection() {
  return (
    <section className="bg-[#0B1B3A] py-16 px-4">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Comparativo Estratégico: notPaper vs SEI
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Compare lado a lado e entenda a diferença entre um sistema de processo eletrônico e uma plataforma completa de transformação digital.
          </p>
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-8 mb-10 text-white text-sm">
          <div className="flex flex-col items-center gap-1">
            <FaCheck className="text-green-400 text-xl" />
            <span>Evidência forte</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MdWarning className="text-yellow-400 text-xl" />
            <span>Parcial</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaTimes className="text-red-500 text-xl" />
            <span>Não possui</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl">
          <table className="w-full border-collapse">

            {/* HEAD */}
            <thead>
              <tr className="bg-[#1E3A8A] text-white">
                <th className="p-4 text-left">Categoria</th>
                <th className="p-4 text-center">notPaper</th>
                <th className="p-4 text-center">SEI</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 bg-[#0f172a] hover:bg-[#1e293b] transition"
                >
                  <td className="p-4 font-semibold text-white">
                    {row.category}
                  </td>

                  {/* notpaper */}
                  <td className="p-4 text-gray-200">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <StatusIcon level="success" />
                      <span>{row.notpaper}</span>
                    </div>
                  </td>

                  {/* sei */}
                  <td className="p-4 text-gray-200">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <StatusIcon level={row.level} />
                      <span>{row.sei}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center">
          <p className="text-gray-300 max-w-2xl mx-auto">
            Na prática, o SEI organiza processos. A notPaper transforma a operação.
          </p>
        </div>
      </div>
    </section>
  );
}