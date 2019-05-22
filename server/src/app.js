const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const helmet = require("koa-helmet");
const respond = require("koa-respond");
const logger = require("koa-logger");
const static = require("koa-static");
const path = require("path");
var session = require("koa-session-minimal");
var MysqlStore = require("koa-mysql-session");

const port = process.env.PROT || "3009";
const router = new Router();
const app = new Koa();

require("./router")(router);

const staticPath = "../client/build";

app
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(respond())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(static(path.join(process.cwd(), staticPath)))
  .listen(port, () => {
    console.log("hello koa!port:", port);
  });
