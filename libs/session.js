const session=require('koa-session');
const fs=require('promise-fs');
const config=require('../config');

module.exports=async server=>{
  try{
    let buffer=await fs.readFile(config.key_path);
    server.keys=JSON.parse(buffer.toString());
  }catch(e){
    console.log('读取key文件失败，请重新生成');

    console.error(e);

    return;
  }

  server.use(session({
    maxAge: config.maxAge,
    renew: true,
  }, server));

}
