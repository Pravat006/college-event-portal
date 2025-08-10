import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Ignore generated code and allow it to bypass linting (Prisma client etc.)
const eslintConfig = [
  {
    ignores: [
      "src/generated/**", // prisma generated client
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // (Optional) relaxed rules can go here if needed later
];

export default eslintConfig;
