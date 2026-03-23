import LogosRow from "@/components/sections/clientes/logos-row";

const logosEmpresas = [
  { img: "/image/clientes/Nelson_Wilians.png", alt: "Nelson Wilians" },
  { img: "/image/clientes/Makita.png", alt: "Makita" },
  { img: "/image/clientes/Ituran.png", alt: "Ituran" },
  { img: "/image/clientes/Irko.png", alt: "Irko" },
  { img: "/image/clientes/Pryor.png", alt: "Pryor" },
  { img: "/image/clientes/Urban.png", alt: "Urban" },
  { img: "/image/clientes/Ellas_Contabilidade.png", alt: "Ellas Contabilidade" },
  { img: "/image/clientes/Nova_SB.png", alt: "Prefeitura de São Bernardo" },
];

const logosPrefeituras = [
  { img: "/image/clientes/brumadinho.png", alt: "Prefeitura de Brumadinho" },
  { img: "/image/clientes/Camara_Doresopolis.png", alt: "Câmara de Doresópolis" },
  { img: "/image/clientes/Camara_rg_serra.png", alt: "Câmara de Rio Grande da Serra" },
  { img: "/image/clientes/ciminas.png", alt: "Consórcio Ciminas" },
  { img: "/image/clientes/Doresopolis.png", alt: "Prefeitura de Doresópolis" },
  { img: "/image/clientes/Ipero.png", alt: "Prefeitura de Iperó" },
  { img: "/image/clientes/Jandira.png", alt: "Prefeitura de Jandira" },
  { img: "/image/clientes/ministerio_agricultura.png", alt: "Ministério da Agricultura, Pecuária e Abastecimento" },
  { img: "/image/clientes/Monsenhor.png", alt: "Prefeitura de Monsenhor Paulo" },
  { img: "/image/clientes/Navegantes.png", alt: "Prefeitura de Navegantes" },
  { img: "/image/clientes/Ouro_Preto.png", alt: "Prefeitura de Ouro Preto" },
  { img: "/image/clientes/Pedrinopolis.png", alt: "Prefeitura de Pedrinópolis" },
  { img: "/image/clientes/Piumhi.png", alt: "Prefeitura de Piumhi" },
  { img: "/image/clientes/sabara.png", alt: "Prefeitura de Sabará" },
  { img: "/image/clientes/Sao_Gotardo.png", alt: "Prefeitura de São Gotardo" },
];

export default function ClientesSection() {
  return (
    <section id="clientes" className="w-full pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <h2 className="mb-16 text-center text-2xl font-bold md:text-3xl">
        <span className="text-2xl text-[#0043FE] md:text-4xl">Prefeituras e empresas </span>
        <span>que já confiaram em nossa solução</span>
      </h2>
      <div className="mb-8">
        <LogosRow logos={logosEmpresas} />
      </div>
      <LogosRow logos={logosPrefeituras} />
    </section>
  );
}
