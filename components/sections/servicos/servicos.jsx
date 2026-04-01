import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

export default function ServicosSection() {
  return (
    <section id="services" className="bg-gradient-to-br from-blue-50 to-[#d3dbf1] pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            Recursos <strong className="text-3xl text-[#0043FE] md:text-4xl">Poderosos</strong>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">Descubra como nosso sistema pode mudar a forma como você trabalha</p>
        </div>
        <div className="flex flex-col gap-[100px]">
          <div className="flex max-w-[1000px] rounded-2xl bg-gradient-to-r from-white to-[#E0E7F7]">
            <Image
              className="max-w-[420px] rounded-l-2xl"
              src="/image/ged.png"
              alt="Visual do módulo GED"
              width={840}
              height={500}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ height: "auto" }}
            />
            <div className="flex flex-col justify-between rounded-r-2xl border-2 border-[#EDF4FD] border-b-0 border-l-0">
              <div className="p-8">
                <h2 className="mb-8 text-center text-2xl">GED</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt error consequatur libero, dolor, enim porro placeat,
                  laborum temporibus quam eos id repellat fugit? Autem soluta ab eaque libero alias quis!
                </p>
              </div>
              <div>
                <h3>Antes</h3>
                <ul>
                  <li>Teste</li>
                </ul>
              </div>
              <div className="flex justify-center gap-6 rounded-br-2xl bg-gradient-to-r from-[#DFE7F7] to-[#A8C9F8] px-8 py-4">
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex max-w-[1000px] rounded-2xl bg-gradient-to-l from-white to-[#FFFEFE]">
            <div className="flex flex-col justify-between rounded-l-2xl border-2 border-[#FBEEEA] border-b-0 border-r-0">
              <div className="p-8">
                <h2 className="mb-8 text-center text-2xl">AUTOMAÇÃO</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt error consequatur libero, dolor, enim porro placeat,
                  laborum temporibus quam eos id repellat fugit? Autem soluta ab eaque libero alias quis!
                </p>
              </div>
              <div className="flex justify-center gap-6 rounded-bl-2xl bg-gradient-to-l from-[#FEFCFB] to-[#F7DFD7] px-8 py-4">
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
              </div>
            </div>
            <Image
              className="max-w-[420px] rounded-r-2xl"
              src="/image/automacao.png"
              alt="Visual de automação de processos"
              width={840}
              height={500}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ height: "auto" }}
            />
          </div>

          <div className="flex max-w-[1000px] rounded-2xl bg-gradient-to-r from-white to-[#E0E7F7]">
            <Image
              className="max-w-[420px] rounded-l-2xl"
              src="/image/app.png"
              alt="Visual do aplicativo da cidade"
              width={840}
              height={500}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{ height: "auto" }}
            />
            <div className="flex flex-col justify-between rounded-r-2xl border-2 border-[#D6D8F8] border-b-0 border-l-0">
              <div className="p-8">
                <h2 className="mb-8 text-center text-2xl">APP SUA CIDADE</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt error consequatur libero, dolor, enim porro placeat,
                  laborum temporibus quam eos id repellat fugit? Autem soluta ab eaque libero alias quis!
                </p>
              </div>
              <div className="flex justify-center gap-6 rounded-br-2xl bg-gradient-to-r from-[#DFE7F7] to-[#AF92FD] px-8 py-4">
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
                <span className="rounded-2xl bg-white p-2">Tag</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
