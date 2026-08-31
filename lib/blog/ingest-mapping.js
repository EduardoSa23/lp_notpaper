import { BLOG_CATEGORIES } from "@/lib/blog/model";
import { isSafeHref } from "@/lib/blog/rich-text";

/**
 * Traducao do vocabulario da entrega para o do blog.
 *
 * O modulo de marketing produz blocos com nomes proprios (`paragrafo`,
 * `subtitulo`, `citacao`, `lista`, com campos `texto`, `itens`, `ordenada`,
 * `citado`). O blog usa outros (`paragraph`, `heading`, `quote`, `list`, com
 * `text`, `items`, `ordered`, `cite`).
 *
 * O texto de um bloco chega como uma LISTA DE TRECHOS - `[{ texto, endereco? }]`
 * - em que um trecho com `endereco` e um link. Enquanto o modulo estiver
 * migrando, uma string simples tambem e aceita e vira um trecho unico; esta e
 * uma das duas unicas portas que toleram a forma antiga (a outra e a leitura do
 * banco, em `queries.js`). Ver `lib/blog/rich-text.js`.
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

/**
 * Traduz o texto de um bloco para a lista de trechos do modelo.
 *
 * Aceita as duas formas: a lista `[{ texto, endereco? }]` e - transitoriamente,
 * enquanto o modulo migra - uma string simples.
 */
function translateRuns(value, campo, index, onde = `bloco na posicao ${index}`) {
  // Forma antiga: string simples vira um trecho sem link.
  if (typeof value === "string") {
    if (value.trim() === "") refuse(`${onde}: "${campo}" ausente ou vazio`);
    return [{ text: value }];
  }

  if (!Array.isArray(value) || value.length === 0) {
    refuse(`${onde}: "${campo}" deve ser texto ou uma lista de trechos nao vazia`);
  }

  return value.map((trecho, i) => {
    if (typeof trecho?.texto !== "string" || trecho.texto === "") {
      refuse(`${onde}: trecho ${i} de "${campo}" sem "texto"`);
    }

    const run = { text: trecho.texto };

    // `endereco` ausente ou vazio e texto puro, e isso e o caso comum.
    const endereco = trecho.endereco;
    if (endereco !== undefined && endereco !== null && endereco !== "") {
      // Recusar em vez de descartar o endereco: um link que deveria existir e
      // desaparece em silencio da pagina e pior de descobrir do que uma
      // entrega recusada com o motivo escrito.
      if (!isSafeHref(endereco)) {
        refuse(`${onde}: trecho ${i} de "${campo}" tem endereco recusado ("${endereco}") - use http ou https`);
      }

      run.href = endereco;
    }

    return run;
  });
}

const TRANSLATORS = {
  paragrafo: (bloco, index) => ({
    type: "paragraph",
    text: translateRuns(bloco.texto, "texto", index),
  }),

  subtitulo: (bloco, index) => ({
    type: "heading",
    text: translateRuns(bloco.texto, "texto", index),
  }),

  citacao: (bloco, index) => {
    const traduzido = { type: "quote", text: translateRuns(bloco.texto, "texto", index) };

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

    // Cada item da lista tem o mesmo tratamento do texto de um paragrafo: pode
    // ser string ou lista de trechos, e pode conter link.
    const itens = bloco.itens.map((item, i) =>
      translateRuns(item, "item", index, `bloco na posicao ${index}, item ${i}`)
    );

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
