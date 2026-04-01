import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const sobreData = {
  title: "Sobre a",
  highlight: "notPaper",
  description1:
    "Somos uma empresa especializada em transformação digital, com mais de 20 anos de experiência ajudando empresas a crescer e se adaptar ao mundo digital.",
  description2:
    "Nossa missão é fornecer soluções inovadoras e personalizadas que impulsionem o sucesso dos nossos clientes, combinando tecnologia de ponta com estratégias comprovadas.",
  mission: "Transformar negócios através da tecnologia",
  vision: "Ser referência em inovação digital",
};

export default function SobreSection() {
  return (
    <section id="sobre" className="section-anchor bg-gradient-to-br from-blue-50 to-[#d3dbf1] pb-12 pt-12 md:pb-16 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse items-center gap-12 md:grid md:grid-cols-2">
          <div>
            <Image
              src="/image/bg_sobre.jpg"
              alt="Equipe trabalhando"
              width={620}
              height={460}
              className="max-w-[620px] rounded-2xl shadow-2xl"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ height: "auto" }}
            />
          </div>
          <div>
            <h2 className="mb-6 text-center text-2xl font-bold md:text-left md:text-3xl">
              {sobreData.title} <strong className="text-3xl text-[#0043FE] md:text-4xl">{sobreData.highlight}</strong>
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600 md:text-xl">{sobreData.description1}</p>
            <p className="mb-8 leading-relaxed text-gray-600 md:text-lg">{sobreData.description2}</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Missão</h3>
                <p className="text-gray-600 md:text-lg">{sobreData.mission}</p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Visão</h3>
                <p className="text-gray-600 md:text-lg">{sobreData.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
