# Kotlin Web Site — React Router 7 Migration

> **Task #2**: Migration to React Router 7 Framework Mode with SSR

This project migrates a legacy server-rendered Flask application with embedded React components to **React Router 7 in Framework Mode** with full Server-Side Rendering, while preserving the original visual appearance and interactive functionality.

The original architecture used Flask/Jinja2 for routing and page structure, with React mounted only for interactive sections. This migration moves to a unified React Router SSR architecture where React handles both the page structure and interactivity.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
git clone https://github.com/jjcoll/kotlin-homepage-rr7
cd kotlin-homepage-rr7
npm install --legacy-peer-deps
```

> **Note**: `--legacy-peer-deps` is required due to peer dependency conflicts in the legacy `@rescui` packages.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run start
```

---

## Approach

I started fresh from the React Router 7 template rather than retrofitting the existing project. This avoided carrying over Webpack/SPA-specific assumptions that would have complicated SSR integration.

### Project Structure

The project follows a **co-location** approach — components keep their styles, data, and types together in the same folder:

```
app/
├── root.tsx                 # Root layout, meta, links, error boundary
├── routes.ts                # Route configuration
├── routes/
│   └── home/
│       ├── index.tsx        # Home route with loader + meta
│       └── index.scss
├── components/
│   ├── Header/              # Recreated header (CSS from @jetbrains package)
│   ├── Footer/              # Recreated footer (CSS from @jetbrains package)
│   ├── HeaderSection/       # Hero section with feature cards
│   ├── WhyKotlinSection/
│   │   └── ProgrammingLanguage/   # Code tabs component
│   ├── UsageSection/        # Testimonials with sorting
│   ├── LatestFromKotlinSection/
│   ├── StartSection/
│   └── Layout/              # Container/Section primitives
├── styles/                  # Global SCSS (reset, fonts, grid)
└── assets/                  # Fonts, images, icons
```

TypeScript is used throughout the project.

---

## SSR and Hydration Fixes

Migrating to SSR introduced several hydration challenges. The server-rendered HTML must match exactly what the client renders on first paint, or React will throw hydration errors.

### Random Tab Selection — ProgrammingLanguage Component

**Problem**: The original code used `Math.random()` during render to select the initial tab. Since random values differ between server and client, this caused a hydration mismatch.

**Solution**: The random value is now computed in the route's `loader` function (runs on the server). It's passed through loader data as `initialCodeTabIndex` and used to initialise the component state:

```tsx
// routes/home/index.tsx
export function loader({ request }: Route.LoaderArgs) {
  const initialCodeTabIndex = Math.floor(Math.random() * 5);
  return { initialCodeTabIndex };
}
```

The component receives this as a prop and uses it as the initial state, ensuring server and client render the same tab.

### User Preference Persistence — UsageSection Sorting

**Problem**: The original code read sorting preferences from `localStorage` during render. `localStorage` doesn't exist on the server, causing either a crash or hydration mismatch.

**Solution**: Replaced `localStorage` with cookies. Cookies are sent with the HTTP request, so the server can read them in the loader:

```tsx
// routes/home/index.tsx
export function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const sortByName = cookieHeader.includes("kotlin-testimonials-order=name");
  return { sortByName };
}
```

The component receives `initialSortByName` as a prop. When the user toggles sorting, it updates state and writes to `document.cookie` for persistence.

### HeaderSection Card Visibility — Mobile Responsiveness

**Problem**: The original code used `window.innerWidth < 768` directly in the component body to hide cards on mobile. `window` doesn't exist on the server.

**Solution**: Pure CSS handles card visibility. All cards are rendered in HTML (server and client identical), and CSS hides the 3rd and 4th cards on mobile:

```scss
.header-section .kto-grid > a:nth-child(n + 3) {
  @media screen and (max-width: 768px) {
    display: none;
  }
}
```

This approach has no hydration concerns and no visual flash.

---

## Package Compatibility Issues

The `@rescui` and `@jetbrains` packages were designed for Webpack/client-only rendering. Migrating to Vite + SSR exposed several incompatibilities.

### @rescui Packages — CSS Imports in SSR

**Problem**: `@rescui` packages contain `import './index.css'` inside their JavaScript files. When Node.js tries to import these during SSR, it fails because Node doesn't understand CSS.

**Solution**: Added `ssr.noExternal` in `vite.config.ts` to force Vite to bundle these packages (and handle their CSS) instead of letting Node.js import them directly:

```ts
ssr: {
  noExternal: [/^@rescui\//, /^@jetbrains\//],
}
```

### @rescui/card — Wrong Entry Point

**Problem**: The package's `package.json` has a typo — the `module` field points to `index.ts` instead of `index.js`.

**Solution**: Added an explicit alias in `vite.config.ts` to point to the correct file:

```ts
resolve: {
  alias: {
    "@rescui/card": "@rescui/card/lib/index.js",
  },
},
```

### @jetbrains/kotlin-web-site-ui — CommonJS + require()

**Problem**: The `header.js` and `footer.js` files use CommonJS `require()` syntax. In Vite's SSR environment (ESM), `require` is not defined.

**Attempted fix**: `ssr.optimizeDeps.include` to pre-transform CommonJS to ESM — this did not work.

**Working solution**: Recreated the Header and Footer components manually:

- Import only the CSS: `import '@jetbrains/kotlin-web-site-ui/dist/header.css'`
- CSS class names from the package remain the same which ensures visual match
- Recreated the HTML structure in React

This completely avoids importing the problematic JavaScript.

### React Double-Bundling Prevention

**Problem**: Without explicit configuration, Vite might bundle React during SSR, leading to multiple React instances and hydration errors.

**Solution**: Keep React packages explicitly external:

```ts
ssr: {
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
}
```

---

## Evaluation Criteria

### Correctness of SSR

The page renders on the server for every request. You can verify this by:

1. Disabling JavaScript in the browser — the page content is still visible
2. Viewing the page source — full HTML is present (not just a root div)
3. No hydration errors in the console

All hydration issues (random values, localStorage, window checks) have been resolved as described above.

### Visual Accuracy

The migrated page matches the original design:

- All `@rescui` components are used as-is with the versions from the original repo
- Header and Footer were recreated using the original CSS classes from `@jetbrains/kotlin-web-site-ui`
- No visual regressions were introduced

### Maintainability

- **TypeScript** throughout provides type safety for loader data and component props
- **Co-location** pattern keeps related code together
- **Documented workarounds** — `vite.config.ts` includes comments explaining non-obvious options

### Code Quality

- Data fetching lives in loaders, not inside components
- No client-side hacks to work around SSR — issues were fixed at the root cause
- Clean component structure with clear separation of concerns

---

## Known Limitations

- Navigation links are non-functional by design — the source project is a single-page snapshot of the Kotlin website homepage

---

## Future Considerations

To further align the project with modern SSR standards, the following improvements could be explored:

- **Package Modernization**: Updating the `@rescui` and `@jetbrains` internal libraries to be ESM-native would eliminate the need for the current Vite SSR workarounds and aliases.

- **URL-driven State**: Transitioning UI preferences (like sorting or tab selection) from cookies/state to URL search parameters would make the page state fully shareable and better leverage React Router's data-loading patterns.

---

## Tech Stack

| Layer     | Choice                             |
| --------- | ---------------------------------- |
| Framework | React Router 7 (Framework Mode)    |
| Rendering | SSR + client hydration             |
| Language  | TypeScript                         |
| Styling   | SCSS + `@rescui` component library |
| Build     | Vite                               |
