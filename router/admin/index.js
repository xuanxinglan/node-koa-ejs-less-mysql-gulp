const Router=require('koa-router');

let router=new Router();

router.use(async (ctx,next)=>{
  if(!ctx.session['adminInfo'] && ctx.url!='/admin/login'){
    ctx.redirect('/admin/login');
  }else{
    await next();
  }
});


router.get(['/', 'index'], async ctx=>{
  await ctx.render('admin/index',{avatar:ctx.session['adminInfo'].avatar,username:ctx.session['adminInfo'].username});
});


require('./project')(router);
require('./administrator')(router);
require('./login')(router);

router.get('/logout', async ctx=>{
  ctx.session['adminInfo'] = null;
  ctx.redirect('/admin/login');
});




router.get('/msg', async ctx=>{
  let datas=await ctx.db.query("SELECT * FROM msg_table ORDER BY ID DESC");
  await ctx.render('admin/msg', {datas, tabs, cur_tab: 2});
});



module.exports=router.routes();
