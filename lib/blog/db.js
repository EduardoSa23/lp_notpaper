// Com a extensao explicita: o webpack resolve o subpath sem ela, mas o Node ESM
// nao - e sem isto qualquer script fora do Next quebra na importacao.
import sql from "mssql/msnodesqlv8.js";

import dbConfig from "@/lib/blog/db-config.cjs";

/**
 * Conexao com o SQL Server do blog.
 *
 * Sem senha: a instancia aceita apenas autenticacao Windows, e a conexao usa a
 * identidade do processo. Ver `db-config.cjs`.
 */

// Symbol.for em vez de propriedade solta: `globalThis` e compartilhado com todo
// o resto do processo, e uma chave por string colidiria em silencio.
const POOL_KEY = Symbol.for("notpaper.blog.pool");

/**
 * Limite de tempo imposto por NOS, e nao pelo driver.
 *
 * Medido: com o banco inalcancavel, `Connection Timeout` na string ODBC e
 * `connectionTimeout` no pool NAO surtem efeito - o `mssql` descarta as opcoes
 * irmas quando recebe `connectionString`, e o driver ODBC ainda tenta outros
 * protocolos antes de desistir. A requisicao ficava pendurada indefinidamente,
 * e o visitante via um carregamento que nunca termina.
 *
 * Falhar rapido e o que permite a fronteira de erro do blog aparecer.
 */
const TIMEOUT_MS = 6000;

function withTimeout(promise, acao) {
  let temporizador;

  const limite = new Promise((_, reject) => {
    temporizador = setTimeout(
      () => reject(new Error(`[blog] o banco nao respondeu em ${TIMEOUT_MS / 1000}s (${acao})`)),
      TIMEOUT_MS
    );
  });

  return Promise.race([promise, limite]).finally(() => clearTimeout(temporizador));
}

/**
 * O pool vive em `globalThis` porque o hot reload do Next reavalia modulos: um
 * pool por modulo criaria um pool novo a cada recarga, vazando conexoes ate o
 * servidor recusar.
 *
 * Guarda a PROMESSA, e nao o pool resolvido - senao duas chamadas concorrentes
 * na primeira consulta criariam dois pools.
 */
export async function getPool() {
  if (!globalThis[POOL_KEY]) {
    globalThis[POOL_KEY] = new sql.ConnectionPool({
      connectionString: dbConfig.connectionString(),
      // Alem do timeout da string ODBC: o pool tem os seus, e sem eles uma
      // conexao ou consulta pendurada trava a requisicao que a espera.
      connectionTimeout: dbConfig.CONNECTION_TIMEOUT_SECONDS * 1000,
      requestTimeout: 15000,
    }).connect();
  }

  try {
    return await withTimeout(globalThis[POOL_KEY], "conexao");
  } catch (error) {
    // Falha nao fica em cache: sem isto, um banco indisponivel no primeiro
    // acesso deixaria o processo inteiro sem banco ate ser reiniciado.
    globalThis[POOL_KEY] = undefined;
    throw error;
  }
}

/**
 * Executa uma consulta parametrizada.
 *
 * @param {string} text SQL com parametros nomeados (@nome)
 * @param {Record<string, { type: unknown, value: unknown }>} params
 */
export async function query(text, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const [name, { type, value }] of Object.entries(params)) {
    request.input(name, type, value);
  }

  const result = await withTimeout(request.query(text), "consulta");
  return result.recordset ?? [];
}

/** Tipos do driver, reexportados para as consultas nao importarem o driver. */
export const types = {
  uuid: sql.UniqueIdentifier,
  text: sql.NVarChar,
  int: sql.Int,
  bytes: sql.VarBinary,
  ascii: sql.VarChar,
  timestamp: sql.DateTimeOffset,
  bool: sql.Bit,
};

export { sql };
