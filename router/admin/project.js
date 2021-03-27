const {post} = require('../../libs/body');
const uuid = require('../../libs/uuid');
const {html_encode,html_decode} = require('../../libs/escape');


module.exports = function (router) {

    //显示列表
    router.get('/project-list', async ctx=>{
        await ctx.render('admin/project-list');
    });

    // 获取列表数据
    router.get('/projectList', async ctx => {
        let datas;
        let {page,limit,status,keywords}=ctx.request.query;
        page=parseInt(page);
        limit=parseInt(limit);

        let keys='';

        if(keywords != undefined && keywords != "" && keywords != null){
            keys += ` AND name like '%`+keywords+`%'`
        }

        if(status != '' && status != undefined){
            status=parseInt(status);
            keys += ' AND status='+status+''
        }

        datas=await ctx.db.query(`SELECT ID,name,tags,coverImg,createTime,status,developmentCMS,productionCMS,developmentIOS,productionIOS,developmentAPK,productionAPK,developmentWEB,productionWEB,miniProgram,remark FROM project WHERE 1=1 `+  keys + ` ORDER BY createTime DESC LIMIT ?,?`, [(page-1)*limit, limit]);

        datas[0].name = html_decode(datas[0].name);
        datas[0].summary = html_decode(datas[0].summary);
        datas[0].contentHtml = html_decode(datas[0].contentHtml);
        datas[0].remark = html_decode(datas[0].remark);

        datas[0].developmentCMS = html_decode(datas[0].developmentCMS);
        datas[0].productionCMS = html_decode(datas[0].productionCMS);

        datas[0].developmentWEB = html_decode(datas[0].developmentWEB);
        datas[0].productionWEB = html_decode(datas[0].productionWEB);

        datas[0].developmentIOS = html_decode(datas[0].developmentIOS);
        datas[0].productionIOS = html_decode(datas[0].productionIOS);

        datas[0].developmentAPK = html_decode(datas[0].developmentAPK);
        datas[0].productionAPK = html_decode(datas[0].productionAPK);


        let rows=await ctx.db.query(`SELECT count(*) AS cnt FROM project`);
        let count = rows[0].cnt;

        ctx.body = {
            code: 0,
            msg: "",
            count,
            data:datas
        };
    });


    // 显示添加数据
    router.get('/addProject', async ctx => {
        await ctx.render('admin/add-project');
    });


    // 执行添加数据
    router.post('/addProject', post(), async ctx => {

        let {name, summary, avatar, tags, contentHtml,developmentCMS,productionCMS,developmentIOS,productionIOS,developmentAPK,productionAPK,developmentWEB,productionWEB,miniProgram,remark} = ctx.request.fields;

        if(tags){
            tags = tags.toString();
            tags = tags.split(",");
            tags = tags.join(',')
        }

        name = html_encode(name);
        summary = html_encode(summary);
        contentHtml = html_encode(contentHtml);
        remark = html_encode(remark);

        developmentCMS = html_encode(developmentCMS);
        productionCMS = html_encode(productionCMS);

        developmentWEB = html_encode(developmentWEB);
        productionWEB = html_encode(productionWEB);

        developmentIOS = html_encode(developmentIOS);
        productionIOS = html_encode(productionIOS);

        developmentAPK = html_encode(developmentAPK);
        productionAPK = html_encode(productionAPK);

        //检查
        let rows = await ctx.db.query("SELECT * FROM project WHERE name=?", [name]);

        if (rows.length > 0) {
            ctx.body = {
                code: 1,
                msg: `项目已存在：${name}`,
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

            await ctx.db.query("INSERT INTO project (ID,name,summary,coverImg,tags,contentHtml,createTime,developmentCMS,productionCMS,developmentIOS,productionIOS,developmentAPK,productionAPK,developmentWEB,productionWEB,miniProgram,remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [id, name, summary, avatar, tags, contentHtml,createTime,developmentCMS,productionCMS,developmentIOS,productionIOS,developmentAPK,productionAPK,developmentWEB,productionWEB,miniProgram,remark]);

            ctx.body = {
                id,
                code: 0,
                msg: "项目添加成功",
            };
        }

    });


    // 获取修改数据
    router.get(`/modProject/:id`, async ctx => {
        let {id} = ctx.params;
        let datas = await ctx.db.query(`SELECT * FROM project WHERE ID=?`, [id]);
        console.log(datas)

        datas[0].name = html_decode(datas[0].name);
        datas[0].summary = html_decode(datas[0].summary);
        datas[0].contentHtml = html_decode(datas[0].contentHtml);

        datas[0].remark = html_decode(datas[0].remark);

        datas[0].developmentCMS = html_decode(datas[0].developmentCMS);
        datas[0].productionCMS = html_decode(datas[0].productionCMS);

        datas[0].developmentWEB = html_decode(datas[0].developmentWEB);
        datas[0].productionWEB = html_decode(datas[0].productionWEB);

        datas[0].developmentIOS = html_decode(datas[0].developmentIOS);
        datas[0].productionIOS = html_decode(datas[0].productionIOS);

        datas[0].developmentAPK = html_decode(datas[0].developmentAPK);
        datas[0].productionAPK = html_decode(datas[0].productionAPK);

        if (datas) {
            await ctx.render('admin/modProject', {datas});

        } else {
            ctx.body = {
                code: 1,
                msg: "找不到数据",
            };
        }

    });



    //删除项目
    router.get(`/delProject/:id`, async ctx => {
        let {id} = ctx.params;

        let rows = await ctx.db.query(`SELECT * FROM project WHERE ID=?`, [id]);

        if (rows.length > 0) {
            await ctx.db.query(`DELETE FROM project WHERE ID=?`, [id]);
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


    //发布、取消发布
    router.post('/publishProject', post(), async ctx => {
        let {id,status} = ctx.request.fields;

       await ctx.db.query(`UPDATE project SET status = '`+ status +`' WHERE ID=?`, id);

        ctx.body = {
            code: 0,
            msg: "修改成功",
        };

    });



    //提交修改
    router.post('/modProject', post(), async ctx => {
        let {id,name, summary, avatar, tags, contentHtml,developmentCMS,productionCMS,developmentIOS,productionIOS,developmentAPK,productionAPK,developmentWEB,productionWEB,miniProgram,remark} = ctx.request.fields;

        if(tags){
            tags = tags.toString();
            tags = tags.split(",");
            tags = tags.join(',')
        }
        name = html_encode(name);
        summary = html_encode(summary);
        contentHtml = html_encode(contentHtml);
        remark = html_encode(remark);

        developmentCMS = html_encode(developmentCMS);
        productionCMS = html_encode(productionCMS);

        developmentWEB = html_encode(developmentWEB);
        productionWEB = html_encode(productionWEB);

        developmentIOS = html_encode(developmentIOS);
        productionIOS = html_encode(productionIOS);

        developmentAPK = html_encode(developmentAPK);
        productionAPK = html_encode(productionAPK);

        await ctx.db.query(`UPDATE project SET name = '`+ name +`',summary = '` + summary +`',coverImg = '`+ avatar + `',tags = '`+ tags + `',contentHtml = '`+ contentHtml + `',developmentCMS = '`+ developmentCMS + `',productionCMS = '`+ productionCMS + `',developmentIOS = '`+ developmentIOS + `',productionIOS = '`+ productionIOS + `',developmentAPK = '`+ developmentAPK + `',productionAPK = '`+ productionAPK + `',developmentWEB = '`+ developmentWEB + `',productionWEB = '`+ productionWEB + `',miniProgram = '`+ miniProgram + `',remark = '`+ remark + `' WHERE ID=?`, id);

        ctx.body = {
            code: 0,
            msg: "修改成功",
        };

    });




};
