# Migration Issues Log

## Purpose

This document tracks issues encountered while migrating the Kotlin homepage from an older React/Webpack setup to React Router 7 (Vite + SSR). Use this as a reference when:

- Resuming work after context reset
- Debugging similar issues in the future
- Understanding why certain Vite config options exist

---

## Issue 1: ReactDOM.render is not a function

### Problem

```tsx
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, container);
```

TypeScript error:
```
Property 'render' does not exist on type 'typeof import("react-dom")'
```

### Explanation

React 18 (used by React Router 7) removed the legacy `ReactDOM.render` API. This was the standard way to mount React apps in React 17 and earlier:

```tsx
// Old way (React 17)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

React 18 introduced `createRoot`:

```tsx
// New way (React 18+)
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')).render(<App />);
```

### Solution for React Router 7

In React Router 7, you don't manually mount the app at all. The framework handles rendering via its entry points (`entry.client.tsx`, `entry.server.tsx`).

Instead of a file that calls `ReactDOM.render`, you:

1. Export your page as a route component
2. Register it in `app/routes.ts`
3. Let React Router handle the rendering

```tsx
// app/routes/home/route.tsx - just export the component
export default function HomePage() {
  return <div>...</div>;
}
```

```ts
// app/routes.ts
import { index } from "@react-router/dev/routes";
export default [
  index("routes/home/route.tsx")
];
```

---

## Issue 2: Cannot find package 'prop-types'

### Problem

```
Cannot find package 'prop-types' imported from
/node_modules/@rescui/ui-contexts/lib/layering-provider.js
```

### Explanation

`prop-types` was bundled with React until version 15.5 (2017). After that, it became a separate package. Older component libraries often list it as a "peer dependency" - meaning they expect it to already exist in your project rather than installing it themselves.

The `@rescui` packages were built during a time when most React projects already had `prop-types` installed. In a fresh React Router 7 project, it's not included by default.

### Solution

```bash
npm install prop-types
```

---

## Issue 3: Failed to resolve entry for package "@rescui/card"

### Problem

```
[vite] Internal server error: Failed to resolve entry for package "@rescui/card".
The package may have incorrect main/module/exports specified in its package.json.
```

### Explanation

When you import a package like this:

```tsx
import { cardCn } from "@rescui/card";
```

The bundler (Vite) needs to find the actual file to load. It looks at the package's `package.json` for directions:

```json
{
  "main": "lib/index.js",      // CommonJS entry (older Node.js style)
  "module": "lib/index.ts"     // ES Module entry (modern, Vite prefers this)
}
```

Vite prefers the `module` field for ES modules. The problem: `@rescui/card` has a **typo** in its package.json:

```json
"module": "lib/index.ts"   // <-- Points to .ts file
```

But the actual files in the package are:

```
lib/
  index.js     <-- Compiled JavaScript (this exists)
  index.d.ts   <-- TypeScript declarations
  card.js
```

There is no `index.ts` - only `index.js`. The package author accidentally wrote `.ts` instead of `.js`.

**Why it worked in the old project:** Webpack has different resolution logic and falls back to the `main` field when `module` fails. Vite is stricter and fails immediately.

### Solution

Add an alias in `vite.config.ts` to point Vite to the correct file:

```ts
export default defineConfig({
  resolve: {
    alias: {
      "@rescui/card": "@rescui/card/lib/index.js",
    },
  },
});
```

This tells Vite: "When you see `@rescui/card`, go directly to `lib/index.js` instead of checking package.json."

### Alternative Solution (not used)

You can use `patch-package` to fix the typo in the package.json permanently. This creates a patch file that's auto-applied after every `npm install`. We attempted this but `patch-package` v8 didn't detect the changes for unknown reasons.

---

## Issue 4: Unknown file extension ".css" for @rescui/button

### Problem

```
Unknown file extension ".css" for
/node_modules/@rescui/button/lib/index.css
```

### Explanation

React Router 7 uses **Server-Side Rendering (SSR)** by default. This means:

1. Your React code runs on the **server** (Node.js) first to generate HTML
2. The HTML is sent to the browser
3. React "hydrates" on the **client** to make it interactive

The problem: inside `@rescui/button`, there's code like this:

```js
// Inside @rescui/button/lib/index.js
import './index.css';
```

When this runs:
- **In the browser:** Bundlers handle CSS imports, no problem
- **On the server (Node.js):** Node.js has no idea what to do with a `.css` file - it only understands JavaScript

The `@rescui` packages were designed for **client-side only** rendering with Webpack, which processes everything before it reaches the browser. They never expected their code to run in Node.js.

### Solution

Add `ssr.noExternal` to `vite.config.ts`:

```ts
export default defineConfig({
  ssr: {
    noExternal: [/@rescui\/.*/],
  },
});
```

This tells Vite: "Don't let Node.js import `@rescui` packages directly. Instead, bundle them through Vite's pipeline during SSR."

Vite knows how to handle CSS:
- Extract it for the client
- Ignore/stub it on the server

**This does NOT disable SSR.** Your app still server-renders. It only changes how Vite processes these specific packages.

### Why modern packages don't have this issue

Modern packages handle CSS differently:

1. **Separate CSS entry:** You import CSS explicitly
   ```tsx
   import "@modern-ui/button/styles.css";
   import { Button } from "@modern-ui/button";
   ```

2. **CSS-in-JS:** Styles are generated in JavaScript (Emotion, styled-components)

3. **Conditional exports:** Package provides different entry points for Node vs browser

4. **Build-time CSS:** Tools like Tailwind extract styles at build time

---

## Issue 5: "require is not defined" for @jetbrains packages

### Problem

```
require is not defined
    at Object.8955 (/node_modules/@jetbrains/kotlin-web-site-ui/dist/header.js:4:1309)
```

### Explanation

This issue occurs when we try to fix the CSS import error (Issue 4) for `@jetbrains/kotlin-web-site-ui`.

Here's the conflict:

1. **Without `noExternal`**: Node.js tries to import CSS files directly → fails with "Unknown file extension .css"

2. **With `noExternal`**: Vite bundles the package, but `@jetbrains/kotlin-web-site-ui` uses **CommonJS** syntax (`require()`), while Vite's SSR bundler expects **ES Modules** (`import`)

The package was built with Webpack, which outputs CommonJS bundles. Vite's ES Module evaluator doesn't have a `require` function, so it crashes.

**Visual explanation:**

```
@jetbrains/kotlin-web-site-ui/dist/header.js contains:
    var something = require('./other-module');  // CommonJS syntax
                    ^^^^^^^
                    This doesn't exist in Vite's ESM environment
```

### Solution

Use `ssr.optimizeDeps.include` to tell Vite to pre-transform the CommonJS files into ESM before running them:

```ts
export default defineConfig({
  ssr: {
    noExternal: [/^@rescui\//, /^@jetbrains\//],
    optimizeDeps: {
      include: [
        "@jetbrains/kotlin-web-site-ui/dist/header.js",
        "@jetbrains/kotlin-web-site-ui/dist/footer.js",
      ],
    },
  },
});
```

This tells Vite:
1. Don't let Node.js import these packages directly (`noExternal`)
2. Pre-transform these specific CommonJS files into ESM before SSR runs (`optimizeDeps.include`)

### Why CommonJS vs ESM matters

| CommonJS (old) | ES Modules (modern) |
|----------------|---------------------|
| `const x = require('y')` | `import x from 'y'` |
| `module.exports = x` | `export default x` |
| Synchronous loading | Async-friendly |
| Used by: Webpack, older Node.js | Used by: Vite, modern Node.js, browsers |

Webpack bundles everything into CommonJS by default. Vite uses native ES Modules. When mixing old Webpack-built packages with Vite, you hit this mismatch.

### Alternative Solution (if above doesn't work)

Make the components client-only using React's lazy loading:

```tsx
import { lazy, Suspense } from 'react';

const Header = lazy(() => import('~/components/Header'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
    </Suspense>
  );
}
```

This skips SSR for these components entirely, avoiding the Node.js/ESM issues.

---

## Current vite.config.ts

After all fixes:

```ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      "@rescui/card": "@rescui/card/lib/index.js",
    },
  },
  ssr: {
    noExternal: [/^@rescui\//, /^@jetbrains\//],
    optimizeDeps: {
      include: [
        "@jetbrains/kotlin-web-site-ui/dist/header.js",
        "@jetbrains/kotlin-web-site-ui/dist/footer.js",
      ],
    },
  },
});
```

---

## Summary Table

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| `ReactDOM.render` not found | React 18 removed legacy API | Use React Router's routing system |
| `prop-types` not found | Peer dependency not installed | `npm install prop-types` |
| `@rescui/card` resolve failed | Typo in package.json (`module` points to `.ts` not `.js`) | Vite alias to correct path |
| `.css` extension error | Node.js can't import CSS during SSR | `ssr.noExternal` for @rescui packages |
| `require is not defined` | CommonJS package in ESM environment | `ssr.optimizeDeps.include` to pre-transform |

---

## Notes for Future Context

If you're returning to this project after a context reset:

1. The migration is from an older webpack-based React project to React Router 7 (Vite + SSR)
2. The `@rescui` packages are JetBrains' internal UI library - old, designed for webpack/client-only
3. Most issues stem from these packages not being SSR-compatible or Vite-compatible
4. Check `vite.config.ts` for the workarounds currently in place
5. If new `@rescui` packages cause issues, likely solutions are:
   - Add to `resolve.alias` (if module resolution fails)
   - Already covered by `ssr.noExternal` regex (if CSS import fails)
