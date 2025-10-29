import { Hono } from "hono";
import { contentRoutes } from "./routes/roure.ts";
import { staticRoutes } from "./routes/staticRouter.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.redirect('/index.html');
});

app.route("/content", contentRoutes);
app.route('', staticRoutes);
app.notFound((c) => {
  return c.text('Not Found', 404);
});

export default app