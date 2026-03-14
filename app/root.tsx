import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

// Favicon imports
import faviconSvg from "~/assets/images/favicon.svg";
import faviconIco from "~/assets/images/favicon.ico";
import appleTouchIcon from "~/assets/images/apple-touch-icon.png";
import appleTouchIcon72 from "~/assets/images/apple-touch-icon-72x72.png";
import appleTouchIcon114 from "~/assets/images/apple-touch-icon-114x114.png";
import appleTouchIcon144 from "~/assets/images/apple-touch-icon-144x144.png";

export const links: Route.LinksFunction = () => [
  // DNS Prefetch
  { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
  { rel: "dns-prefetch", href: "//fonts.gstatic.com" },
  { rel: "dns-prefetch", href: "//resources.jetbrains.com" },

  // Preconnect for fonts
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },

  // Favicons
  { rel: "icon", type: "image/svg+xml", href: faviconSvg },
  { rel: "alternate icon", href: faviconIco },

  // Apple Touch Icons
  { rel: "apple-touch-icon", href: appleTouchIcon },
  { rel: "apple-touch-icon", sizes: "72x72", href: appleTouchIcon72 },
  { rel: "apple-touch-icon", sizes: "114x114", href: appleTouchIcon114 },
  { rel: "apple-touch-icon", sizes: "144x144", href: appleTouchIcon144 },

  // Google Fonts stylesheet
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
