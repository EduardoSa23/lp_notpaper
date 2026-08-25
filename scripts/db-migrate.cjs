/**
 * Aplica as migracoes de `db/migrations` em ordem, uma vez cada.
 *
 * Idempotencia vem da tabela de controle `dbo.schema_migrations`, e nao de cada
 * script ser reescritivel: rodar de novo nao reaplica o que ja consta.
 *
 * Cria o banco quando ele nao existe, para que um ambiente novo fique pronto
 * sem passo manual - e o que `blog/persistencia-de-posts` exige.
 */
const fs = require("fs");
const path = require("path");
const sql = require("mssql/msnodesqlv8");

const { readEnv, connectionString, masterConnectionString } = require("../lib/blog/db-config.cjs");

const MIGRATIONS_DIR = path.join(__dirname, "..", "db", "migrations");

function migrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort(); // NNN_ no inicio do nome define a ordem
}

/**
 * T-SQL usa `GO` como separador de lote, e ele nao e comando do servidor: quem
 * separa e a ferramenta. Sem isso, um script com CREATE TABLE e CREATE INDEX
 * chegaria como um lote so e falharia.
 */
function batches(script) {
  return script
    .split(/^\s*GO\s*$/im)
    .map((batch) => batch.trim())
    .filter((batch) => batch.length > 0);
}

async function ensureDatabase() {
  const { database } = readEnv();
  const pool = await new sql.ConnectionPool({ connectionString: masterConnectionString() }).connect();

  try {
    const existing = await pool.request().input("nome", sql.NVarChar, database).query("SELECT DB_ID(@nome) AS id");

    if (existing.recordset[0].id !== null) {
      console.log(`  banco "${database}" ja existe`);
      return;
    }

    // Nome validado por `readEnv` antes de chegar aqui - CREATE DATABASE nao
    // aceita parametro.
    await pool.request().batch(`CREATE DATABASE [${database}]`);
    console.log(`  banco "${database}" criado`);
  } finally {
    await pool.close();
  }
}

async function ensureControlTable(pool) {
  await pool.request().batch(`
    IF OBJECT_ID('dbo.schema_migrations', 'U') IS NULL
    CREATE TABLE dbo.schema_migrations (
        nome        nvarchar(200)  NOT NULL CONSTRAINT PK_schema_migrations PRIMARY KEY,
        aplicada_em datetimeoffset NOT NULL CONSTRAINT DF_schema_migrations_aplicada DEFAULT (SYSDATETIMEOFFSET())
    )`);
}

async function applied(pool) {
  const result = await pool.request().query("SELECT nome FROM dbo.schema_migrations");
  return new Set(result.recordset.map((row) => row.nome));
}

async function main() {
  console.log("== migracoes do blog ==");
  await ensureDatabase();

  const pool = await new sql.ConnectionPool({ connectionString: connectionString() }).connect();

  try {
    await ensureControlTable(pool);
    const jaAplicadas = await applied(pool);

    const files = migrationFiles();
    if (files.length === 0) {
      console.log("  nenhuma migracao em db/migrations");
      return;
    }

    let novas = 0;

    for (const name of files) {
      if (jaAplicadas.has(name)) {
        console.log(`  ja aplicada: ${name}`);
        continue;
      }

      const script = fs.readFileSync(path.join(MIGRATIONS_DIR, name), "utf8");
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        // DDL e transacional no SQL Server: se um lote falhar, nada da migracao fica.
        for (const batch of batches(script)) {
          await new sql.Request(transaction).batch(batch);
        }

        await new sql.Request(transaction).input("nome", sql.NVarChar, name).query("INSERT INTO dbo.schema_migrations (nome) VALUES (@nome)");

        await transaction.commit();
        console.log(`  aplicada:    ${name}`);
        novas += 1;
      } catch (error) {
        await transaction.rollback();
        throw new Error(`falha em ${name}: ${error.message}`);
      }
    }

    console.log(novas === 0 ? "  nada a aplicar" : `  ${novas} migracao(oes) aplicada(s)`);
  } finally {
    await pool.close();
  }
}

main().catch((error) => {
  console.error(`\n[db-migrate] ${error.message}`);
  process.exitCode = 1;
});
