import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      // Fix @rescui/card package.json typo (module points to .ts instead of .js)
      "@rescui/card": "@rescui/card/lib/index.js",
    },
  },
  ssr: {
    noExternal: [/^@rescui\//, /^@jetbrains\//],
    // explicitly keep react external so it doesn't get double-bundled
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
});
