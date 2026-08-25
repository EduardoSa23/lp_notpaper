import { BtnWhatsapp } from "@/components/ui/btn-whatsapp";

/**
 * Chamada para contato do post.
 *
 * O link do WhatsApp NAO e redefinido aqui: `BtnWhatsapp` ja carrega o numero
 * de atendimento do site, entao existe um lugar so para mudar se ele trocar.
 */
export default function PostCta({ className = "" }) {
  return (
    <aside className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <h2 className="text-base font-bold text-gray-900">Quer isso rodando na sua gestão?</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Fale com um especialista da notPaper e veja como aplicar na prática na sua administração.
      </p>
      <BtnWhatsapp className="mt-5 w-full text-sm">Falar com um especialista</BtnWhatsapp>
    </aside>
  );
}
