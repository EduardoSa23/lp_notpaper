/**
 * Configuracao de acesso ao SQL Server, lida do ambiente.
 *
 * Nao ha senha: a instancia so aceita autenticacao Windows, e a conexao usa a
 * identidade do processo (`Trusted_Connection=yes`). O que vem do ambiente e
 * servidor, banco e nome do driver ODBC - o driver esta aqui porque e
 * exatamente o que difere entre a maquina de desenvolvimento e o servidor.
 *
 * Em CommonJS para o aplicador de migracoes (`scripts/db-migrate.cjs`) e o app
 * lerem a mesma configuracao, em vez de cada um montar a sua.
 */

const REQUIRED = ["SQLSERVER_SERVER", "SQLSERVER_DATABASE", "SQLSERVER_ODBC_DRIVER"];

// Curto de proposito: o banco fica na mesma maquina. Se ele nao responde em
// cinco segundos, esperar mais nao vai ajudar - falhar rapido deixa a pagina de
// erro aparecer em vez de a requisicao travar.
const CONNECTION_TIMEOUT_SECONDS = 5;

// Nome de banco entra por interpolacao no CREATE DATABASE (nao ha como
// parametrizar), entao o formato e restrito antes de chegar la.
const DATABASE_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,62}$/;

function readEnv() {
  const missing = REQUIRED.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `[blog] configuracao de banco ausente: ${missing.join(", ")}. ` +
        "Defina em .env.local (desenvolvimento) ou no ambiente do servidor. " +
        "Ver .env.example."
    );
  }

  const database = process.env.SQLSERVER_DATABASE;

  if (!DATABASE_NAME_PATTERN.test(database)) {
    throw new Error(
      `[blog] SQLSERVER_DATABASE "${database}" invalido: use letras, numeros e sublinhado, comecando por letra.`
    );
  }

  return {
    server: process.env.SQLSERVER_SERVER,
    database,
    odbcDriver: process.env.SQLSERVER_ODBC_DRIVER,
  };
}

/** String de conexao para um banco especifico. */
function connectionStringFor(databaseName) {
  const { server, odbcDriver } = readEnv();

  // `Connection Timeout` NAO e opcional: sem ele, um banco inalcancavel deixa a
  // requisicao pendurada indefinidamente - o visitante ve um carregamento que
  // nunca termina, que e pior que uma pagina de erro.
  return (
    `Driver={${odbcDriver}};Server=${server};Database=${databaseName};` +
    "Trusted_Connection=yes;TrustServerCertificate=yes;" +
    `Connection Timeout=${CONNECTION_TIMEOUT_SECONDS};`
  );
}

/** Conexao com o banco do blog. */
function connectionString() {
  return connectionStringFor(readEnv().database);
}

/** Conexao com `master`, usada so para criar o banco quando ele nao existe. */
function masterConnectionString() {
  return connectionStringFor("master");
}

module.exports = {
  CONNECTION_TIMEOUT_SECONDS,
  readEnv,
  connectionString,
  masterConnectionString,
  DATABASE_NAME_PATTERN,
};
