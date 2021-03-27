const path=require('path');
const base='/api';
module.exports={
  //服务器
  port: 8080,
  md5_key: '忽逢桃花林，夹岸数百步，中无杂树，芳草鲜美，落英缤纷。',

  //数据库
  db_host: 'localhost',
  db_port: 3306,
  db_user: 'root',
  db_pass: '123456',
  db_name: 'test',


  //session
  maxAge: 2 * 60 * 1000,

  // 请求地址
  newsLishs: base + '/news/',

  //请求数据
  limit:10,

  //key
  key_count: 1024,
  key_len: 1024,
  key_path: path.resolve(__dirname, '.keys'),

  //log
  log_path: path.resolve(__dirname, 'logs'),

  //static
  static_path: path.resolve(__dirname, 'static'),
  article_path: path.resolve(__dirname, 'static/article'),

  //errors
  errors_404: path.resolve(__dirname, 'errors/404.html'),
  errors_500: path.resolve(__dirname, 'errors/500.html'),
};
