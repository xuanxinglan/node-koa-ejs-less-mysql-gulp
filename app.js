const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");

let app = new Koa();
let router = new Router();

router.get("/index", ctx => {
    ctx.body = "4000端口"
});



router.post("/Serverpost",ctx=>{
    ctx.body = "跨域请求"
})

app.use(router.routes());
app.listen(4000)
