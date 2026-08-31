/**
 * Texto de bloco com link: uma lista de trechos.
 *
 * Um trecho e `{ text }` ou `{ text, href }`. O texto de um paragrafo, de um
 * subtitulo, de uma citacao e de cada item de lista e sempre uma LISTA de
 * trechos - inclusive quando nao ha link nenhum, caso em que a lista tem um
 * trecho so.
 *
 * ── UMA FORMA SO POR DENTRO ─────────────────────────────────────────────────
 *
 * A tolerancia a forma antiga (texto como string) vive apenas nas duas portas:
 * a ingestao, enquanto o modulo de marketing ainda envia string, e a leitura do
 * banco, onde ha posts gravados antes desta mudanca. Depois delas, o modelo tem
 * uma forma unica - o render, a validacao e as ancoras do sumario nunca veem
 * string. Dois caminhos de render seriam dois caminhos para manter, e o menos
 * exercitado apodrece.
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
 * Converte para lista de trechos. Aceita:
 *   - lista de trechos (a forma canonica, devolvida como esta)
 *   - string (a forma antiga, virando um trecho unico)
 *
 * Qualquer outra coisa devolve lista vazia - quem valida decide se isso e erro.
 */
export function normalizeRuns(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value !== "") return [{ text: value }];
  return [];
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
