const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Router = require("koa-router");
const router = new Router();

const dataGenerator = require("./src/PostsGenerator/dataGenerator");
const PostGenerator = require("./src/PostWithComments/PwCGenerator");

const app = new Koa();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app.callback());

app.use(cors());

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    json: true,
    multipart: true,
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }

  // => CORS
  app.use(
    cors({
      origin: "*",
      "Access-Control-Allow-Origin": true,
      "X-Requested-With": true, //возможно это поможет
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );
});

const fakeData = new dataGenerator();
const postGenerator = new PostGenerator();
postGenerator.start();

router.get("/messages/unread", async (ctx) => {
  fakeData.start();
  ctx.response.body = {
    status: "ok",
    messages: fakeData.messagesList,
    timestamp: Date.now(),
  };
  console.log(ctx.response.body, "result");
});

router.get("/posts/latest", async (ctx) => {
  ctx.response.body = {
    status: "ok",
    data: postGenerator.postsList,
  };
  console.log(ctx.response.body, "result");
});

router.get("/posts/:id/comments/latest", async (ctx) => {
  const comments = postGenerator.filteredComments(ctx.request.params.id, 3);

  ctx.response.body = {
    status: "ok",
    data: comments,
  };
});

server.listen(PORT, () =>
  console.log(`Koa server has been started on port ${PORT} ...`)
);
