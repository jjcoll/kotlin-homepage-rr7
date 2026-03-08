// This is a route module
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// loader: provide data to route components before they are rendered 
// usually usually called on server when SSR or during build during pre-rendering (SSG)
export async function loader() {
  return { message: "Hello World!" }
}


// default export in route module defines the component that will render when the route matches
export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <p>{loaderData.message}</p>
  )
}
