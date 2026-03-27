"use client";

import { useState } from "react";
import { FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from "react-icons/fa6";

const contatoData = {
  title: "Entre em",
  highlight: "Contato",
  subtitle: "Pronto para transformar seu negócio? Vamos conversar!",
  contactItems: [
    {
      href: "tel:+551146040000",
      title: "Telefone",
      text: "(11) 4604-0000",
      icon: FaPhone,
      wrapperColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      href: "https://api.whatsapp.com/send?phone=5511941398031&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20notPaper%20e%20gostaria%20de%20entender%20melhor%20as%20solu%C3%A7%C3%B5es.%20Pode%20me%20ajudar%3F",
      title: "WhatsApp",
      text: "(11) 94139-8031",
      icon: FaWhatsapp,
      wrapperColor: "bg-green-100",
      iconColor: "text-green-600",
      external: true,
    },
    {
      href: "mailto:contato@notpaper.com.br",
      title: "Email",
      text: "contato@notpaper.com.br",
      icon: FaEnvelope,
      wrapperColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      href: "https://www.google.com/maps/place/Av.+Dep.+Castro+de+Carvalho,+941+-+Vila+J%C3%BAlia,+Po%C3%A1+-+SP,+08551-035/@-23.5204327,-46.3569128,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce7b25ec81d259:0x14c7d1f34875f531!8m2!3d-23.5204377!4d-46.3520419!16s%2Fg%2F11h4zprh16?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
      title: "Endereço",
      text: "Av. Deputado Castro de Carvalho, 941, Poá - SP",
      icon: FaLocationDot,
      wrapperColor: "bg-purple-100",
      iconColor: "text-purple-600",
      external: true,
    },
  ],
};

export default function ContatoSection() {
  const [formState, setFormState] = useState({ loading: false, message: "", error: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      setFormState({ loading: true, message: "Enviando dados...", error: false });
      const response = await fetch("https://formspree.io/f/mkgqnjlb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Falha no envio");

      form.reset();
      setFormState({ loading: false, message: "Dados enviados com sucesso!", error: false });
    } catch {
      setFormState({ loading: false, message: "Erro ao enviar o formulário.", error: true });
    }
  };

  return (
    <section id="contato" className="relative pb-12 pt-24 md:pb-16 md:pt-28 section-anchor">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/videos/bg_contato.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <div className="relative container items-center mx-auto px-4 grid md:grid-cols-2 gap-10">
        <div>
          <div className="mb-6">
            <span className="inline-flex rounded-full bg-teal-300 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-900">
              Inovação digital
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl font-bold leading-tight">
              Funcionalidades que redefinem a <span className="text-blue-700">eficiência pública.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed bg-white opacity-90 border border-blue-700 rounded-xl p-4">
              Descubra como a notPaper integra tecnologias de ponta para eliminar burocracia, aumentar produtividade e acelerar a
              transformação digital de ponta a ponta.
            </p>
          </div>

          <div>
            <div>
              {contatoData.contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                  >
                    <div className="animacao-faleConosco mb-4 flex items-center rounded-2xl border border-[#8daaff] bg-[#F0F3FF] p-3 opacity-90 shadow-lg">
                      <div className={`mr-4 flex h-10 w-10 items-center justify-center rounded-lg ${item.wrapperColor}`}>
                        <Icon className={`text-lg ${item.iconColor}`} />
                      </div>
                      <div className="flex gap-2">
                        <div className="font-semibold text-gray-900">{item.title}:</div>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-center text-2xl font-semibold">Solicitar Demonstração</h2>
            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="nome"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mensagem</label>
                <textarea
                  rows="4"
                  name="mensagem"
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]"
                />
              </div>
              <button
                type="submit"
                disabled={formState.loading}
                className="w-full rounded-lg bg-[#0043FE] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0135c5] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formState.loading ? "Enviando..." : "Enviar Mensagem"}
              </button>
              {formState.message && <p className={`text-sm ${formState.error ? "text-red-600" : "text-green-600"}`}>{formState.message}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
