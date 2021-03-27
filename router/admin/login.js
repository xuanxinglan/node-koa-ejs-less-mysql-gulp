const {post} = require('../../libs/body');
const passwordLib = require('../../libs/password');

module.exports = function (router) {


    router.get('/login', async ctx=>{
        // ctx.session['adminInfo'] = null;
        await ctx.render('admin/login', {error: null, account: '', password: ''});
    });

    router.post('/login', post(), async ctx=>{
        let {account,password}=ctx.request.fields;
        account=account.toLowerCase();

        async function render(msg){
            await ctx.render('admin/login', {error: msg, account, password});
        }

        //1.用户存在？
        let rows=await ctx.db.query("SELECT * FROM administrator WHERE account=?", [account]);

        if(rows.length==0){
            await render('账号不存在');
        }else{
            //2.密码？
            if(rows[0].password==passwordLib(password)){
                ctx.session['adminInfo'] = rows[0];

                await render('登录成功');
                ctx.redirect('/admin/');
            }else{
                await render('用户名或密码不对');
            }
        }

    });

};
