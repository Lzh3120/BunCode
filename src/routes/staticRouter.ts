import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import fs from 'node:fs'

export const staticRoutes = new Hono()

staticRoutes.use(
  "/*",
  serveStatic({
    root: "./public",
    getContent: async path => {
      return fs.readFileSync(path, "utf-8");
    }
  })
);
