import { COVER_FORMATS } from "@/lib/blog/model";

/**
 * Verificacao e tipo de midia da capa.
 *
 * Estes bytes chegam pela rede e sao servidos a visitantes sob o dominio do
 * site - o unico lugar do sistema onde isso acontece. Duas defesas:
 *
 *  1. o formato declarado e conferido contra o CONTEUDO da imagem, pela
 *     assinatura do arquivo. Quem entrega tambem confere do lado dele, mas
 *     confiar nisso seria confiar num campo de texto que veio pela rede;
 *
 *  2. o tipo de midia servido sai de `COVER_FORMATS`, e nunca do texto
 *     recebido. Ecoar `"image/" + formato` transformaria a rota da capa em
 *     vetor para servir conteudo ativo sob o dominio do site.
 */

// Assinaturas: os primeiros bytes de cada formato aceito.
const SIGNATURES = [
  {
    format: "png",
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    format: "jpeg",
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    // WebP e um contêiner RIFF: "RIFF" nos bytes 0-3 e "WEBP" nos 8-11.
    format: "webp",
    matches: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
];

export function isRecognizedFormat(format) {
  return typeof format === "string" && Object.hasOwn(COVER_FORMATS, format);
}

/** Tipo de midia da lista do site. Null para formato nao reconhecido. */
export function mediaTypeFor(format) {
  return isRecognizedFormat(format) ? COVER_FORMATS[format] : null;
}

/** Formato real dos bytes, pela assinatura. Null quando nao e imagem reconhecida. */
export function detectFormat(bytes) {
  if (!bytes || bytes.length === 0) return null;

  const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return SIGNATURES.find(({ matches }) => matches(buffer))?.format ?? null;
}

/**
 * Confere a capa recebida: formato reconhecido E bytes correspondentes a ele.
 *
 * @returns {{ ok: true, format: string } | { ok: false, motivo: string }}
 */
export function verifyCover(bytes, declaredFormat) {
  if (!isRecognizedFormat(declaredFormat)) {
    return {
      ok: false,
      motivo: `formato "${declaredFormat}" nao reconhecido (aceitos: ${Object.keys(COVER_FORMATS).join(", ")})`,
    };
  }

  const detected = detectFormat(bytes);

  if (detected === null) {
    return { ok: false, motivo: "o conteudo recebido nao e uma imagem de formato reconhecido" };
  }

  if (detected !== declaredFormat) {
    return {
      ok: false,
      motivo: `o formato declarado ("${declaredFormat}") nao corresponde ao conteudo ("${detected}")`,
    };
  }

  return { ok: true, format: detected };
}
