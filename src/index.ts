import { Hono, type Context } from "hono";
import { contentRoutes } from "./routes/roure.ts";
import { staticRoutes } from "./routes/staticRouter.ts";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";

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
//验证token
const verifyMyToken = async (token: string, c: Context): Promise<boolean> => {
  // 示例：在这里查询数据库或缓存来验证 Token 是否有效
  if (token === 'VALID_API_KEY_12345') {
    // 可以在这里将用户信息设置到 Context 中，供后续路由使用
    c.set('userId', 'user_abc');
    return true; // 验证成功
  }
  return false; // 验证失败
};
//验证信息
app.use('/*',
  bearerAuth({
    verifyToken: verifyMyToken,
    prefix:'token'
  })
);
//'Authorization': `token ${userToken}`
app.notFound((c) => {
  return c.text('Not Found', 404);
});

export default app