import LogosRow from "@/components/sections/clientes/logos-row";

const logosEmpresas = [
  { img: "/image/clientes/Nelson_Wilians.png", alt: "Nelson Wilians", nome: "Nelson Wilians" },
  { img: "/image/clientes/Makita.png", alt: "Makita", nome: "Makita" },
  { img: "/image/clientes/Ituran.png", alt: "Ituran", nome: "Ituran" },
  { img: "/image/clientes/Irko.png", alt: "Irko", nome: "Irko" },
  { img: "/image/clientes/Pryor.png", alt: "Pryor", nome: "Pryor" },
  { img: "/image/clientes/Urban.png", alt: "Urban", nome: "Urban" },
  { img: "/image/clientes/Ellas_Contabilidade.png", alt: "Ellas Contabilidade", nome: "Ellas Contabilidade" },
  { img: "/image/clientes/Nova_SB.png", alt: "Nova/SB", nome: "Nova/SB" },
];

const logosPrefeituras = [
  { img: "/image/clientes/brumadinho.png", alt: "Prefeitura de Brumadinho", nome: "Brumadinho" },
  { img: "/image/clientes/Camara_rg_serra.png", alt: "Câmara de Rio Grande da Serra", nome: "Câmara de Rio Grande da Serra" },
  { img: "/image/clientes/ciminas.png", alt: "Consórcio Ciminas", nome: "Consórcio Ciminas" },
  { img: "/image/clientes/Ipero.png", alt: "Prefeitura de Iperó", nome: "Iperó" },
  { img: "/image/clientes/Jandira.png", alt: "Prefeitura de Jandira", nome: "Jandira" },
  { img: "/image/clientes/matozinhos.png", alt: "Prefeitura de Matozinhos", nome: "Matozinhos" },
  {
    img: "/image/clientes/ministerio_agricultura.png",
    alt: "Ministério da Agricultura, Pecuária e Abastecimento",
    nome: "Min. da Agricultura",
  },
  { img: "/image/clientes/Monsenhor.png", alt: "Prefeitura de Monsenhor Paulo", nome: "Monsenhor Paulo" },
  { img: "/image/clientes/Navegantes.png", alt: "Prefeitura de Navegantes", nome: "Navegantes" },
  { img: "/image/clientes/Pedrinopolis.png", alt: "Prefeitura de Pedrinópolis", nome: "Pedrinópolis" },
  { img: "/image/clientes/Piumhi.png", alt: "Prefeitura de Piumhi", nome: "Piumhi" },
  { img: "/image/clientes/sabara.png", alt: "Prefeitura de Sabará", nome: "Sabará" },
  { img: "/image/clientes/Sao_Gotardo.png", alt: "Prefeitura de São Gotardo", nome: "São Gotardo" },
  { img: "/image/clientes/secretaria_sp.png", alt: "Secretaria de Cultura de São Paulo", nome: "Sec. de Cultura de SP" },
  { img: "/image/clientes/tupaciguara.png", alt: "Prefeitura de Tupaciguara", nome: "Tupaciguara" },
];

export default function ClientesSection() {
  return (
    <section id="clientes" className="w-full pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <h2 className="mb-16 text-center max-w-4xl mr-2 ml-2 md:mx-auto text-3xl md:text-5xl font-bold">
        <span className="text-[#0043FE]">Prefeituras e empresas </span>
        <span>que já confiaram em nossa solução</span>
      </h2>
      <div className="mb-8">
        <LogosRow logos={logosEmpresas} />
      </div>
      <LogosRow logos={logosPrefeituras} />
    </section>
  );
}
