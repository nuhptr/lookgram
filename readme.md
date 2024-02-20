# Lookgram

## Dependencies

-  [tailwindcss](https://tailwindcss.com/) - pnpm install -D tailwindcss
-  [postcss](https://postcss.org/) - pnpm install -D postcss
-  [autoprefixer](https://www.npmjs.com/package/autoprefixer) - pnpm install -D autoprefixer
-  [@types/node] - pnpm i -D @types/node

## Options

-  Change relative path

```ts
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
