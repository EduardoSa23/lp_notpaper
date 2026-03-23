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
      href: "https://wa.me/5511941398031",
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
      href: "https://www.google.com/maps?q=São+Paulo,+SP",
      title: "Endereço",
      text: "São Paulo, SP",
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
    <section id="contato" className="bg-gradient-to-br from-blue-50 to-[#0043FE] pb-12 pt-12 md:pb-16 md:pt-20 section-anchor">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
            {contatoData.title} <strong className="text-3xl text-[#0043FE] md:text-4xl">{contatoData.highlight}</strong>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">{contatoData.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" name="nome" required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Telefone</label>
                <input type="tel" name="telefone" required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mensagem</label>
                <textarea rows="4" name="mensagem" required className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#0043FE]" />
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

          <div className="rounded-2xl border border-[#0043FE] bg-blue-200 p-8 opacity-90 shadow-lg">
            <h3 className="mb-6 text-center text-2xl font-bold">Fale Conosco</h3>
            <div>
              {contatoData.contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.title} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
                    <div className="animacao-faleConosco mb-4 flex items-center">
                      <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${item.wrapperColor}`}>
                        <Icon className={`text-xl ${item.iconColor}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
