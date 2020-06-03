const Koa=require('koa');
const config=require('./config');
const network=require('./libs/network');
const {accessLogger,systemLogger} = require('./libs/log4');
const fs=require('promise-fs');
const ejs=require('koa-ejs');
const path=require('path');
// const { SitemapStream } = require('sitemap');


const Router=require('koa-router');

let server=new Koa();

(async ()=>{
    server.use(accessLogger())

    server.context.db=await require('./libs/mysql');


    //
    let error_404='';
    try{
        error_404=await fs.readFile(config.errors_404);
        error_404=error_404.toString();
    }catch(e){
        console.log('read 404 file error');
    }

    let error_500='';
    try{
        error_500=await fs.readFile(config.errors_500);
        error_500=error_500.toString();
    }catch(e){
        console.log('read 500 file error');
    }


    //全局错误处理
    server.use(async (ctx,next)=>{
        try{
            await next();

            if(!ctx.body){
                ctx.status=404;
                ctx.body=error_404||'Not Found';
            }
        }catch(e){
            systemLogger.error(e)
            ctx.status=500;
            ctx.body=error_500||'Internal Server Error';

        }
    });


    let router=new Router();

    //session
    await require('./libs/session')(server);

    //router
    server.use(require('./router'));

    //ejs
    ejs(server, {
        root: path.resolve(__dirname, 'template'),
        layout: false,
        viewExt: 'ejs',
        cache: false,
        debug: false
    });

    server.listen(config.port);

    network.forEach(ip=>{
        if(config.port==80){
            console.log(`server running at http://${ip}`);
        }else{
            console.log(`server running at http://${ip}:${config.port}`);
        }
    });

})();
