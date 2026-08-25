"use client";

import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import Swal from "sweetalert2";

const BUTTON_BASE =
  "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-[#0043FE] hover:text-[#0043FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0043FE] focus-visible:ring-offset-2";

// Fallback para navegador sem clipboard assincrono ou fora de contexto seguro.
function copyWithSelection(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(field);
  }
}

export default function PostShare({ title, url, className = "" }) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  async function handleCopy() {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) copied = copyWithSelection(url);

    await Swal.fire({
      icon: copied ? "success" : "error",
      title: copied ? "Link copiado" : "Não foi possível copiar",
      text: copied ? url : "Copie o endereço direto da barra do navegador.",
      confirmButtonColor: "#0043FE",
      timer: copied ? 2200 : undefined,
      timerProgressBar: copied,
    });
  }

  return (
    <section aria-labelledby="compartilhar-post" className={className}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 id="compartilhar-post" className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Compartilhar
        </h2>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleCopy} className={BUTTON_BASE}>
            <FiLink className="h-4 w-4" aria-hidden="true" />
            Copiar link
          </button>

          {/* Links diretos: nenhum SDK de rede social e carregado na pagina. */}
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={BUTTON_BASE}>
            <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={BUTTON_BASE}>
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
