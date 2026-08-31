/**
 * Ancoras dos subtitulos do post.
 *
 * O sumario e o corpo do post precisam do MESMO id para cada subtitulo - por
 * isso o calculo vive aqui e nao dentro de cada componente.
 *
 * O texto do subtitulo e uma lista de trechos e pode conter link; a ancora e o
 * item do sumario usam o texto puro. Um link DENTRO de um item do sumario -
 * que ja e um link para a secao - seria um link dentro de outro.
 */
import { plainText } from "@/lib/blog/rich-text";

export function slugifyHeading(text) {
  return String(text)
    .normalize("NFD")
    // Remove os acentos separados pelo NFD para o slug sair sem marca combinante.
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Lista os subtitulos do conteudo com id unico e estavel.
 * Textos repetidos ganham sufixo numerico na ordem em que aparecem.
 *
 * @returns {Array<{ id: string, text: string, index: number }>}
 */
export function collectHeadings(content) {
  if (!Array.isArray(content)) return [];

  const used = new Map();

  return content.reduce((headings, block, index) => {
    if (block?.type !== "heading") return headings;

    const text = plainText(block.text);
    if (!text) return headings;

    const base = slugifyHeading(text) || `secao-${index}`;
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);

    headings.push({
      id: seen === 0 ? base : `${base}-${seen + 1}`,
      text,
      index,
    });

    return headings;
  }, []);
}

/** Mapa posicao-do-bloco -> id da ancora, para o corpo do post. */
export function buildHeadingIdMap(content) {
  return new Map(collectHeadings(content).map((heading) => [heading.index, heading.id]));
}
