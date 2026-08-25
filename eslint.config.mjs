import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// Preset "Strict" do Next: regras recomendadas + Core Web Vitals.
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    // O ESLint 9 so analisa js/mjs/cjs por padrao - sem isto os .jsx do projeto
    // passariam sem ser lidos e o lint daria falso positivo.
    files: ["**/*.{js,mjs,cjs,jsx}"],
  },
  {
    ignores: [".next/**", "out/**", "node_modules/**", ".static-export-stash/**"],
  },
];

export default eslintConfig;
