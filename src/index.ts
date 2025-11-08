import { Hono, type Context } from "hono";
import { contentRoutes } from "./routes/roure.ts";
import { staticRoutes } from "./routes/staticRouter.ts";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { serve } from "bun";

const app = new Hono();

app.get("/", (c) => {
  return c.redirect('/index.html');
});

app.route("/content", contentRoutes);
app.route('', staticRoutes);
//跨域配置
app.use('/*', cors({
  origin:'https://note.lzhpro.top',
  allowMethods: ['GET', 'POST', 'OPTIONS'], // 允许的 HTTP 方法
  allowHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  maxAge: 3600, // 预检请求（Preflight Request）的缓存时间（秒）
}));

//'Authorization': `token ${userToken}`
app.notFound((c) => {
  return c.text('Not Found', 404);
});
serve({ 
  fetch: app.fetch, 
  port: 80, 
});
//export default app