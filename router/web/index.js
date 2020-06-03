const Router = require('koa-router');

let router = new Router();


router.get('/', async ctx => {
        await ctx.render('web/index',);
    }
);

router.get(`/detail/:id`, async ctx => {
        let {id} = ctx.params;
    console.log(id)
        await ctx.render('web/detail', {id});


        /*let datas = await ctx.db.query(`SELECT ID,name,contentHtml FROM project WHERE ID=?`, [id]);

        if (datas) {
            await ctx.render('web/details', {datas});

        } else {
            ctx.body = {
                code: 1,
                msg: "找不到数据",
            };
        }*/
    }
);


module.exports = router.routes();


require('./sitemap')(router);


module.exports = router.routes();
