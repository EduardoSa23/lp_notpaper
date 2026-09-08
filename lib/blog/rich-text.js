/**
 * Texto de bloco com link: uma lista de trechos.
 *
 * Um trecho e `{ text }` ou `{ text, href }`. O texto de um paragrafo, de um
 * subtitulo, de uma citacao e de cada item de lista e sempre uma LISTA de
 * trechos - inclusive quando nao ha link nenhum, caso em que a lista tem um
 * trecho so.
 *
 * ── UMA FORMA SO, DA ENTRADA AO RENDER (desde 04/09/2026) ───────────────────
 *
 * Havia duas portas que toleravam a forma antiga (texto como string): a
 * ingestao, enquanto o modulo de marketing ainda a enviava, e a leitura do
 * banco, onde havia posts gravados antes dos trechos. As duas fecharam — o
 * modulo parou de enviar string em 26/08, e a migracao 003 converteu os 15
 * posts que restavam.
 *
 * Agora nao ha caminho por onde uma string chegue: a ingestao recusa, e o banco
 * so tem a forma canonica. O render, a validacao e as ancoras do sumario nunca
 * veem string. Dois caminhos de render seriam dois caminhos para manter, e o
 * menos exercitado apodrece.
 */

// So http e https. Outros esquemas (`javascript:`, `data:`) nao viram link, e
// isto vale mesmo com o modulo garantindo o mesmo do lado dele: sanitizar na
// renderizacao e o que impede um dado ruim de virar problema de seguranca.
const SAFE_PROTOCOLS = ["http:", "https:"];

export function isSafeHref(value) {
  if (typeof value !== "string" || value.trim() === "") return false;

  try {
    return SAFE_PROTOCOLS.includes(new URL(value).protocol);
  } catch {
    // Endereco relativo ou malformado: nao e link para fonte externa.
    return false;
  }
}

/** True quando o valor tem a forma de um trecho. */
export function isRun(value) {
  return Boolean(value) && typeof value === "object" && typeof value.text === "string";
}

/**
 * A lista de trechos, ou lista vazia para qualquer outra coisa - quem valida
 * decide se isso e erro.
 *
 * ── POR QUE ELA NAO CONVERTE MAIS STRING ───────────────────────────────────
 *
 * Ela convertia, e era assim que a forma antiga chegava ao render. Hoje um
 * `text` string nao passa por `assertRuns`, e `toPost` valida TODA leitura -
 * entao uma string nem chega aqui: ela e recusada antes, com a posicao do bloco
 * na mensagem.
 *
 * A conversao ficou sem alcance, e mante-la seria pior do que inutil: quem
 * lesse esta funcao concluiria que string ainda e entrada valida, e a
 * tolerancia voltaria por descuido. Foi assim que ela entrou da primeira vez.
 */
export function normalizeRuns(value) {
  return Array.isArray(value) ? value : [];
}

/** O texto sem os links, para ancoras do sumario, slug e prosa corrida. */
export function plainText(runs) {
  return normalizeRuns(runs)
    .map((run) => (isRun(run) ? run.text : ""))
    .join("");
}

/**
 * Valida uma lista de trechos.
 *
 * @param {unknown} value
 * @param {(mensagem: string) => never} fail como reportar o problema
 * @param {string} onde identificacao do bloco, para a mensagem
 */
export function assertRuns(value, fail, onde) {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${onde}: "text" deve ser uma lista de trechos nao vazia.`);
  }

  value.forEach((run, index) => {
    if (!isRun(run)) {
      fail(`${onde}: trecho ${index} nao tem "text".`);
    }

    if (run.text === "") {
      fail(`${onde}: trecho ${index} esta vazio.`);
    }

    // `href` ausente e texto puro, e isso e valido. `href` presente mas
    // inseguro e defeito: melhor recusar do que servir um link para
    // `javascript:` numa pagina publica.
    if (run.href !== undefined && !isSafeHref(run.href)) {
      fail(`${onde}: trecho ${index} tem endereco invalido (${run.href}).`);
    }
  });
}
