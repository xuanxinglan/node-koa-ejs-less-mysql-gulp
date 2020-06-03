const Router = require('koa-router');
const staticFile = require('./static');
const koaServerHttpProxy = require("koa-server-http-proxy");

let router = new Router();

// 跨域处理
router.use(koaServerHttpProxy("/api",{
    target:"https://api.test.com",
    changeOrigin:true
}));

staticFile(router);

router.use('/api', require('./api'));
router.use('', require('./web'));



module.exports = router.routes();
