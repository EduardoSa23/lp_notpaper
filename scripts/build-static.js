/**
 * Gera a pasta `out/` (export estatico) para publicar em um servidor comum.
 *
 * O export estatico do Next nao suporta middleware nem route handlers com POST,
 * entao a area da diretoria (login + APIs de auth) e movida para fora do projeto
 * durante o build e devolvida ao lugar no final, mesmo se o build falhar.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const stash = path.join(root, ".static-export-stash");

// Caminhos que nao existem no site estatico.
const excluded = ["middleware.js", path.join("app", "api"), path.join("app", "diretoria")];

const moved = [];

function move(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

function stashExcluded() {
  for (const relative of excluded) {
    const source = path.join(root, relative);
    if (!fs.existsSync(source)) continue;

    const target = path.join(stash, relative);
    move(source, target);
    moved.push(relative);
    console.log(`[build-static] fora do build: ${relative}`);
  }
}

function restoreExcluded() {
  for (const relative of moved.reverse()) {
    const source = path.join(stash, relative);
    if (!fs.existsSync(source)) continue;

    move(source, path.join(root, relative));
  }

  fs.rmSync(stash, { recursive: true, force: true });
}

if (fs.existsSync(stash)) {
  console.error(
    `[build-static] a pasta ${path.basename(stash)} ja existe - um build anterior foi interrompido.\n` +
      "Devolva os arquivos de dentro dela para o projeto antes de rodar de novo."
  );
  process.exit(1);
}

fs.rmSync(path.join(root, "out"), { recursive: true, force: true });
fs.rmSync(path.join(root, ".next"), { recursive: true, force: true });

let status = 1;

try {
  stashExcluded();

  // Usa o Next instalado no projeto - `npx` baixaria uma versao diferente se faltasse.
  const nextBin = require.resolve("next/dist/bin/next", { paths: [root] });

  const result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_STATIC_EXPORT: "1",
    },
  });

  status = result.status ?? 1;
} finally {
  restoreExcluded();
}

if (status === 0) {
  console.log("\n[build-static] pronto: pasta `out/` gerada na raiz do projeto.");
}

process.exit(status);
