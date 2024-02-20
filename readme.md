# Lookgram

## Dependencies

-  [tailwindcss](https://tailwindcss.com/) - pnpm install -D tailwindcss
-  [postcss](https://postcss.org/) - pnpm install -D postcss
-  [autoprefixer](https://www.npmjs.com/package/autoprefixer) - pnpm install -D autoprefixer
-  [@types/node] - pnpm i -D @types/node
-  [react-router-dom](https://reactrouter.com/en/6.22.1) - pnpm install react-router-dom

## Eslint

important eslint rules

```json
   rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off",
   },
```

## Options

-  Change relative path tsconfig.json

```json
   "baseUrl": ".",
   "paths": {
      "@/*": ["./src/*"]
   },
```

-  Add the following code to the vite.config.ts

```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
})
```
