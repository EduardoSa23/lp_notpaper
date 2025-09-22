$(document).ready(function () {
      // Array de logos
      const logosEmpresas = [
        { img: "./image/clientes/Nelson_Wilians.png", alt: "Nelson Wilians" },
        { img: "./image/clientes/Makita.png", alt: "Makita" },
        { img: "./image/clientes/Ituran.png", alt: "Ituran" },
        { img: "./image/clientes/Irko.png", alt: "Irko" },
        { img: "./image/clientes/Pryor.png", alt: "Pryor" },
        { img: "./image/clientes/Urban.png", alt: "Urban" },
        { img: "./image/clientes/Ellas_Contabilidade.png", alt: "Ella" },
        { img: "./image/clientes/Nova_SB.png", alt: "Prefeitura de São Bernardo" },
        
      ];

      const logosPrefeituras = [
        { img: "./image/clientes/brumadinho.png", alt: "Prefeitura de Brumadinho" },
        { img: "./image/clientes/Camara_Doresopolis.png", alt: "Câmara de dorezópolis" },
        { img: "./image/clientes/Camara_rg_serra.png", alt: "Câmara de Rio Grande da Serra" },
        { img: "./image/clientes/ciminas.png", alt: "Consórcio Ciminas" },
        { img: "./image/clientes/Doresopolis.png", alt: "Prefeitura de Doresopolis" },
        { img: "./image/clientes/Ipero.png", alt: "Prefeitura de Ipero" },
        { img: "./image/clientes/Jandira.png", alt: "Prefeitura de Jandira" },
        { img: "./image/clientes/ministerio_agricultura.png", alt: "Ministério da Agricultura, Pecuária e Abastecimento" },
        { img: "./image/clientes/Monsenhor.png", alt: "Prefeitura de Monsenhor Paulo" },
        { img: "./image/clientes/Navegantes.png", alt: "Prefeitura de Navegantes" },
        { img: "./image/clientes/Ouro_Preto.png", alt: "Prefeitura de Outo preto" },
        { img: "./image/clientes/Pedrinopolis.png", alt: "Prefeitura de Pedrinópolis" },
        { img: "./image/clientes/Piumhi.png", alt: "Prefeitura de Piumhi" },
        { img: "./image/clientes/Sabara.png", alt: "Prefeitura de Sabará" },
        { img: "./image/clientes/Sao_Gotardo.png", alt: "Prefeitura de São Gotardo" },
      ]

      // Renderiza dinamicamente
       function renderLogos(container, logos) {
        let content = "";
        const repeatTimes = 5; // quantidade de repetições para preencher a tela
        for (let i = 0; i < repeatTimes; i++) {
            logos.forEach(logo => {
                content += `
                    <div class="flex items-center justify-center px-6">
                      <img src="${logo.img}" alt="${logo.alt}" class="max-h-16 object-contain grayscale hover:grayscale-0 transition duration-300">
                    </div>
                `;
            });
        }
        $(container).html(content);
      }
      renderLogos("#logos-empresas", logosEmpresas);
      renderLogos("#logos-prefeituras", logosPrefeituras);
    });