import { BLOG_CATEGORIES } from "@/lib/blog/model";

/**
 * Traducao do vocabulario da entrega para o do blog.
 *
 * O modulo de marketing produz blocos com nomes proprios (`paragrafo`,
 * `subtitulo`, `citacao`, `lista`, com campos `texto`, `itens`, `ordenada`,
 * `citado`). O blog usa outros (`paragraph`, `heading`, `quote`, `list`, com
 * `text`, `items`, `ordered`, `cite`).
 *
 * A traducao vive SO nesta fronteira. Aceitar os dois vocabularios dentro do
 * modelo dobraria os casos em `post-body.jsx`, que ignora tipo desconhecido em
 * silencio - um bloco no vocabulario errado desapareceria da pagina sem erro.
 * Por isso tipo nao traduzivel e RECUSA, e nao descarte.
 */

/** Erro de conteudo: a entrega e recusada e quem entrega nao deve retentar. */
export class IngestContentError extends Error {
  constructor(message) {
    super(message);
    this.name = "IngestContentError";
  }
}

function refuse(message) {
  throw new IngestContentError(message);
}

function requireText(value, campo, index) {
  if (typeof value !== "string" || value.trim() === "") {
    refuse(`bloco na posicao ${index}: "${campo}" ausente ou vazio`);
  }

  return value;
}

const TRANSLATORS = {
  paragrafo: (bloco, index) => ({
    type: "paragraph",
    text: requireText(bloco.texto, "texto", index),
  }),

  subtitulo: (bloco, index) => ({
    type: "heading",
    text: requireText(bloco.texto, "texto", index),
  }),

  citacao: (bloco, index) => {
    const traduzido = { type: "quote", text: requireText(bloco.texto, "texto", index) };

    // `citado` e opcional: citacao sem autoria e valida.
    if (typeof bloco.citado === "string" && bloco.citado.trim() !== "") {
      traduzido.cite = bloco.citado;
    }

    return traduzido;
  },

  lista: (bloco, index) => {
    if (!Array.isArray(bloco.itens) || bloco.itens.length === 0) {
      refuse(`bloco na posicao ${index}: lista sem itens`);
    }

    const itens = bloco.itens.map((item, i) => {
      if (typeof item !== "string" || item.trim() === "") {
        refuse(`bloco na posicao ${index}: item ${i} da lista vazio`);
      }

      return item;
    });

    const traduzido = { type: "list", items: itens };

    if (bloco.ordenada === true) traduzido.ordered = true;

    return traduzido;
  },
};

/** Nomes de tipo que a traducao reconhece, para mensagens de erro. */
export const TRANSLATABLE_TYPES = Object.keys(TRANSLATORS);

/**
 * Traduz o corpo da entrega. Lanca `IngestContentError` no primeiro bloco que
 * nao conformar.
 */
export function translateBody(corpo) {
  if (!Array.isArray(corpo) || corpo.length === 0) {
    refuse('"corpo" deve ser uma lista de blocos nao vazia - o blog nao tem o que renderizar');
  }

  return corpo.map((bloco, index) => {
    const translate = TRANSLATORS[bloco?.tipo];

    if (!translate) {
      refuse(
        `bloco na posicao ${index}: tipo "${bloco?.tipo ?? "ausente"}" nao traduzivel ` +
          `(aceitos: ${TRANSLATABLE_TYPES.join(", ")})`
      );
    }

    return translate(bloco, index);
  });
}

/** Confere a categoria contra a lista do blog. */
export function translateCategory(categoria) {
  if (!BLOG_CATEGORIES.includes(categoria)) {
    refuse(
      `categoria "${categoria ?? "ausente"}" nao reconhecida ` +
        `(aceitas: ${BLOG_CATEGORIES.join(", ")})`
    );
  }

  return categoria;
}
