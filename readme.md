# Lookgram

## General Dependencies

-  [@types/node] - pnpm i -D @types/node
-  [react-router-dom](https://reactrouter.com/en/6.22.1) - pnpm install react-router-dom
-  [appwrite](https://appwrite.io/) - pnpm install appwrite

## Shadcn Dependencies

-  [tailwindcss](https://tailwindcss.com/) - pnpm install -D tailwindcss
-  [postcss](https://postcss.org/) - pnpm install -D postcss
-  [autoprefixer](https://www.npmjs.com/package/autoprefixer) - pnpm install -D autoprefixer
-  [tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate) - pnpm install tailwindcss-animate
-  [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) - pnpm install tailwind-merge
-  [class-variance-authority](https://cva.style/docs) - pnpm install class-variance-authority
-  [clsx](https://www.npmjs.com/package/clsx) - pnpm install clsx
-  [lucide-react](https://www.npmjs.com/package/lucide-react) - pnpm install lucide-react
-  [react-hook-form](https://www.npmjs.com/package/react-hook-form) - pnpm install react-hook-form
-  [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers) - pnpm install @hookform/resolvers
-  [zod](https://www.npmjs.com/package/zod) - pnpm install zod
-  [@radix-ui/react-slot](https://www.npmjs.com/package/@radix-ui/react-slot) - pnpm install @radix-ui/react-slot
-  [@radix-ui/react-label](https://www.npmjs.com/package/@radix-ui/react-label) - pnpm install @radix-ui/react-label

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

-  Make the appwrite collection setting in role to any(create, read, update, delete)
-  Make relationship between user and post collection
-  Complete other attribute
-  Make the indexes for caption fullText for search
