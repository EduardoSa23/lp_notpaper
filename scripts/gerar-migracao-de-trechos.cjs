/**
 * Gera a migracao que converte os posts antigos para a forma canonica.
 *
 * ── POR QUE GERAR, E NAO ESCREVER T-SQL ─────────────────────────────────────
 *
 * A transformacao e EXATAMENTE a que `migrateBlocks` (em `queries.js`) ja
 * aplica em toda leitura desses posts. Reescreve-la em JSON_MODIFY seria uma
 * segunda implementacao da mesma regra, e ela poderia divergir — num dado que
 * ja esta publicado, e sem nada avisando.
 *
 * Gerando os valores com a propria funcao e emitindo-os como literais, o
 * resultado e por construcao o que a pagina ja renderiza hoje: a migracao
 * persiste o que a leitura vinha fazendo em memoria, e nada muda na tela.
 *
 * ── O QUE ELE NAO E ─────────────────────────────────────────────────────────
 *
 * Nao e parte do build nem roda em producao. E uma ferramenta de uma vez, cuja
 * saida — `db/migrations/003_*.sql` — e o que fica versionado. Esta aqui para
 * que a proxima pessoa saiba de onde aqueles literais vieram.
 *
 *   node --env-file-if-exists=.env.local scripts/gerar-migracao-de-trechos.cjs
 */
const fs = require("fs");
const path = require("path");
const sql = require("mssql/msnodesqlv8");

const { connectionString } = require("../lib/blog/db-config.cjs");

const SAIDA = path.join(__dirname, "..", "db", "migrations", "003_trechos_nos_posts_antigos.sql");

/** Copia de `normalizeRuns`. Ver o cabecalho: e a funcao da leitura. */
function normalizeRuns(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value !== "") return [{ text: value }];
  return [];
}

/** Copia de `migrateBlocks`. */
function migrateBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;

  return blocks.map((block) => {
    if (!block || typeof block !== "object") return block;

    if (typeof block.text === "string") {
      return { ...block, text: normalizeRuns(block.text) };
    }

    if (block.type === "list" && Array.isArray(block.items)) {
      return { ...block, items: block.items.map(normalizeRuns) };
    }

    return block;
  });
}

/** Um bloco ainda na forma antiga? */
function temFormaAntiga(blocks) {
  if (!Array.isArray(blocks)) return false;

  return blocks.some((block) => {
    if (!block || typeof block !== "object") return false;
    if (typeof block.text === "string") return true;
    if (block.type === "list" && Array.isArray(block.items)) {
      return block.items.some((item) => typeof item === "string");
    }
    return false;
  });
}

/** Literal Unicode para T-SQL: aspa simples dobrada. */
function literal(texto) {
  return "N'" + texto.replace(/'/g, "''") + "'";
}

async function main() {
  // `new ConnectionPool({ connectionString })`, e nao `sql.connect(string)`:
  // com o driver msnodesqlv8 a string vai no objeto de configuracao. Passada
  // solta, ela e lida como nome de fonte de dados ODBC e o erro fala de "fonte
  // de dados nao encontrada", que manda procurar o driver errado.
  const pool = await new sql.ConnectionPool({ connectionString: connectionString() }).connect();

  const { recordset } = await pool.request().query(
    "SELECT id, slug, CAST(content AS nvarchar(max)) AS content FROM posts ORDER BY id"
  );

  const linhas = [];
  let jaCanonicos = 0;

  for (const row of recordset) {
    const blocos = JSON.parse(row.content);

    if (!temFormaAntiga(blocos)) {
      jaCanonicos++;
      continue;
    }

    const convertido = JSON.stringify(migrateBlocks(blocos));

    // Trava: a conversao nao pode deixar forma antiga para tras.
    if (temFormaAntiga(JSON.parse(convertido))) {
      throw new Error(`post ${row.id} continuou na forma antiga depois da conversao`);
    }

    linhas.push({ id: row.id, slug: row.slug, content: convertido });
  }

  console.log(`posts na forma antiga: ${linhas.length}`);
  console.log(`ja canonicos: ${jaCanonicos}`);

  if (linhas.length === 0) {
    console.log("nada a migrar — a migracao nao foi gerada");
    await pool.close();
    return;
  }

  const script = [
    "-- Converte o texto dos blocos dos posts gravados antes dos trechos com link.",
    "--",
    "-- ANTES: \"text\": \"uma frase\"          (e itens de lista como string)",
    "-- DEPOIS: \"text\": [{\"text\": \"uma frase\"}]",
    "--",
    "-- Os valores foram GERADOS por `scripts/gerar-migracao-de-trechos.cjs`,",
    "-- que aplica a mesma funcao que a leitura ja aplicava em memoria a cada",
    "-- requisicao. Por construcao, o que fica gravado e o que a pagina ja",
    "-- renderizava — a migracao persiste a normalizacao, e nao muda o conteudo.",
    "--",
    "-- Depois dela, as duas portas que toleravam a forma antiga saem: a",
    "-- conversao em `ingest-mapping.js` e a normalizacao em `queries.js`.",
    "",
    ...linhas.flatMap((l) => [
      `-- ${l.slug}`,
      `UPDATE posts SET content = ${literal(l.content)} WHERE id = ${l.id};`,
      "",
    ]),
  ].join("\n");

  fs.writeFileSync(SAIDA, script, "utf8");
  console.log(`escrito: ${path.relative(process.cwd(), SAIDA)} (${script.length} caracteres)`);

  await pool.close();
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
