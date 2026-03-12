import { type RouteConfig, index } from "@react-router/dev/routes";

// routes are configured in this file
// routes are made up of two parts, a url pattern + file path to route module 

export default [
  // renders into the root.tsx Outlet at /
  index("routes/home/index.tsx")
] satisfies RouteConfig;


