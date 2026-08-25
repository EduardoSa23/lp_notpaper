/**
 * Formatacao de datas do blog.
 *
 * Fixa em UTC: a data vem em ISO 8601 e nao deve mudar de dia conforme o fuso
 * de quem renderiza ou de quem le.
 */

const LONG = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const SHORT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPublishedAt(isoDate) {
  return LONG.format(new Date(isoDate));
}

export function formatPublishedAtShort(isoDate) {
  return SHORT.format(new Date(isoDate)).replace(".", "");
}

/** Valor do atributo `dateTime` de <time>: so a data, sem hora. */
export function toDateAttribute(isoDate) {
  return new Date(isoDate).toISOString().slice(0, 10);
}

export function formatReadingTime(minutes) {
  return `${minutes} min de leitura`;
}
