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
          <div className="flex bg-gradient-to-r from-white to-[#E0E7F7] rounded-2xl max-w-[1000px]">
            <img className="rounded-l-2xl max-h-[500px]" src="/image/ged.png" alt="" />
            <div className="border-2 border-[#EDF4FD] border-l-0 border-b-0 rounded-r-2xl flex flex-col justify-between">
              <div className="p-8">
                <h2 className="text-2xl text-center mb-8">GED</h2>
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
              <div className="px-8 py-4 flex gap-6 justify-center bg-gradient-to-r from-[#DFE7F7] to-[#A8C9F8] rounded-br-2xl">
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
              </div>
            </div>
          </div>

          <div className="flex ml-auto bg-gradient-to-l from-white to-[#FFFEFE] rounded-2xl max-w-[1000px]">
            <div className="border-2 border-[#FBEEEA] border-r-0 border-b-0 rounded-l-2xl flex flex-col justify-between">
              <div className="p-8">
                <h2 className="text-2xl text-center mb-8">AUTOMAÇÃO</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt error consequatur libero, dolor, enim porro placeat,
                  laborum temporibus quam eos id repellat fugit? Autem soluta ab eaque libero alias quis!
                </p>
              </div>
              <div className="px-8 py-4 flex gap-6 justify-center bg-gradient-to-l from-[#FEFCFB] to-[#F7DFD7] rounded-bl-2xl">
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
              </div>
            </div>
            <img className="rounded-r-2xl max-h-[500px]" src="/image/automacao.png" alt="" />
          </div>

          <div className="flex bg-gradient-to-r from-white to-[#E0E7F7] rounded-2xl max-w-[1000px]">
            <img className="rounded-l-2xl max-h-[500px]" src="/image/app.png" alt="" />
            <div className="border-2 border-[#D6D8F8] border-l-0 border-b-0 rounded-r-2xl flex flex-col justify-between">
              <div className="p-8">
                <h2 className="text-2xl text-center mb-8">APP SUA CIDADE</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt error consequatur libero, dolor, enim porro placeat,
                  laborum temporibus quam eos id repellat fugit? Autem soluta ab eaque libero alias quis!
                </p>
              </div>
              <div className="px-8 py-4 flex gap-6 justify-center bg-gradient-to-r from-[#DFE7F7] to-[#AF92FD] rounded-br-2xl">
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
                <span className="p-2 bg-white rounded-2xl">Tag</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
