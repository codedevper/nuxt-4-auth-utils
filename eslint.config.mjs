// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import { globalIgnores } from "eslint/config";

export default withNuxt(
  // Your custom configs here
  globalIgnores([
    "**/.nuxt/**",
    "**/.data/**",
    "**/.output/**",
    "**/node_modules/**",
    "**/public/**",
    "**/app/components/ui/**",
  ])
)
  .prepend
  // ...Prepend some flat configs in front
  ()
  // Override some rules in a specific config, based on their name
  .override("nuxt/typescript/rules", {
    rules: {
      // ...Override rules, for example:
      "@typescript-eslint/ban-types": "off",
    },
  });
