const {post} = require('../../libs/body');
const passwordLib = require('../../libs/password');
const uuid = require('../../libs/uuid');

module.exports = function (router) {


    //显示列表
    router.get('/administrator-list', async ctx => {
        await ctx.render('admin/administrator-list');
    });


    // 获取列表数据
    router.get('/administratorList', async ctx => {
        let {page}=ctx.request.query;
        let {limit}=ctx.request.query;
        page=parseInt(page);
        limit=parseInt(limit);

        let datas=await ctx.db.query(`SELECT * FROM administrator ORDER BY createTime DESC LIMIT ?,?`, [(page-1)*limit, limit]);
        let rows=await ctx.db.query(`SELECT count(*) AS cnt FROM administrator`);

        let count = rows[0].cnt;
        // count = Math.ceil(count/limit);

        ctx.body = {
            code: 0,
            msg: "",
            count,
            data:datas
        };
    });

    // 显示添加数据
    router.get('/addAdministrator', async ctx => {
        await ctx.render('admin/add-administrator');
    });

    // 获取修改数据
    router.get(`/modAdministrator/:id`, async ctx => {
        let {id} = ctx.params;
        let datas = await ctx.db.query(`SELECT * FROM administrator WHERE ID=?`, [id]);

        if (datas) {
            await ctx.render('admin/modAdministrator', {datas});

        } else {
            ctx.body = {
                code: 1,
                msg: "找不到数据",
            };
        }

    });


    // 执行添加数据
    router.post('/addAdministrator', post(), async ctx => {

        let {account, password, avatar, username, permission} = ctx.request.fields;
        account = account.toLowerCase();

        //检查
        let rows = await ctx.db.query("SELECT * FROM administrator WHERE account=?", [account]);

        if (rows.length > 0) {
            ctx.body = {
                code: 1,
                msg: `账户已存在：${account}`,
            };
        } else {
            let id = uuid();

            let now = new Date();
            let yy = now.getFullYear();      //年
            let mm = now.getMonth() + 1;     //月
            let dd = now.getDate();          //日
            let hh = now.getHours();         //时
            let ii = now.getMinutes();       //分
            let ss = now.getSeconds();       //秒
            let createTime = yy + "-";

            if(mm < 10) createTime += "0";
            createTime += mm + "-";
            if(dd < 10) createTime += "0";
            createTime += dd + " ";
            if(hh < 10) createTime += "0";
            createTime += hh + ":";
            if (ii < 10) createTime += '0';
            createTime += ii + ":";
            if (ss < 10) createTime += '0';
            createTime += ss;


            await ctx.db.query("INSERT INTO administrator (ID,account,password,avatar,username,permission,createTime) VALUES(?,?,?,?,?,?,?)", [id, account, passwordLib(password), avatar, username, permission,createTime]);

            ctx.body = {
                id,
                code: 0,
                msg: "账号添加成功",
            };
        }

    });

    //删除管理员
    router.get(`/delAdministrator/:id`, async ctx => {
        let {id} = ctx.params;

        let rows = await ctx.db.query(`SELECT * FROM administrator WHERE ID=?`, [id]);

        if (rows.length > 0) {
            await ctx.db.query(`DELETE FROM administrator WHERE ID=?`, [id]);
            ctx.body = {
                code: 0,
                msg: "删除成功",
            };

        } else {
            ctx.body = {
                code: 1,
                msg: "找不到数据",
            };
        }

    });


    // 修改管理员数据
    router.post('/modAdministrator', post(), async ctx => {
        let {id, avatar, username, permission,password} = ctx.request.fields;

        if(password !="" && password !="undefined" && password !=null){
            await ctx.db.query(`UPDATE administrator SET username = '`+ username +`',permission = '` + permission +` ',password = '` + passwordLib(password) +`',avatar = '`+ avatar +`' WHERE ID=?`, id);

        }else {
            await ctx.db.query(`UPDATE administrator SET username = '`+ username +`',permission = '` + permission +`',avatar = '`+ avatar +`' WHERE ID=?`, id);
        }

        ctx.body = {
            code: 0,
            msg: "修改成功",
        };

    });

};
