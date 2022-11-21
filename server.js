const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Router = require("koa-router");
const router = new Router();

const dataGenerator = require("./src/PostsGenerator/dataGenerator");
const PostGenerator = require("./src/PostWithComments/PwCGenerator");
const ReactCrud = require("./src/RA-CRUD/PostsManager");
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
});

router.get("/posts/latest", async (ctx) => {
  ctx.response.body = {
    status: "ok",
    data: postGenerator.postsList,
  };
});

router.get("/posts/:id/comments/latest", async (ctx) => {
  const comments = postGenerator.filteredComments(ctx.request.params.id, 3);

  ctx.response.body = {
    status: "ok",
    data: comments,
  };
});

/**ra-router-crud */

const postsCrud = new ReactCrud();
postsCrud.start();

router.get("/posts", async (ctx, next) => {
  ctx.response.body = {
    status: "ok",
    data: postsCrud.postsList,
  };
});

router.get("/posts/:id", async (ctx, next) => {
 

  ctx.response.body = {
    status: "ok",
    data: postsCrud.postsList,
  };
});

router.delete("/posts/:id", async (ctx, next) => {
  console.log(ctx.params, "ctx.params.id");
  const postId = ctx.params.id;
  postsCrud.deletePost(postsCrud.postsList, postId);

  ctx.response.status = 204;
});

router.post("/posts", async (ctx, next) => {
  const data = JSON.parse(ctx.request.body);

  const id = data.id;

  const response = id
    ? postsCrud.upDatePosts(data, id)
    : postsCrud.createdPost(data);
  ctx.response.body = {
    status: "ok",
    data: postsCrud.postsList,
  };
});

server.listen(PORT, () =>
  console.log(`Koa server has been started on port ${PORT} ...`)
);
