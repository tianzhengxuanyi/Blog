// 引用express框架，创建网络服务器
const express = require('express');
// 处理路径
const path = require('path');
// 引入body-parser，处理post参数
const bodyParser = require('body-parser');
// 引入express-session，创建session
const session = require('express-session');
// 引入时间格式处理函数
const moment = require('moment');
// 引入art-template
const template = require('art-template');
// 引入morgan模块，在命令行打印请求信息
const morgan = require('morgan');
// 引入config模块
const config = require('config');

// 创建服务器
const app = express();
// 引入数据库连接
require('./model/connect');
// 引入数据库user对象
const {User} = require('./model/user');
// 处理post请求参数
app.use(bodyParser.urlencoded({extended: false}));
// 配置session
app.use(session({
    secret:'secrit key',
    // 当cookie被删除不会保留初始化的值
    saveUninitialized: false,
    // 设置cookie的过期时间，单位为毫秒
    cookie: {
        maxAge: 24*60*60*1000
    }
}));

// 配置express框架模板所在位置
// set中第一个参数是固定好的，第二个参数为模板绝对路径
app.set('views',path.join(__dirname,'views'));
// 配置express框架模板的默认后缀
// app.set(固定,模板后缀);
app.set('view engine','art');
// 配置渲染art后缀的模板引擎
// app.engine('模板后缀',require('模板引擎'));
app.engine('art',require('express-art-template'));
// 将dateFormat方法添加到art-template中
template.defaults.imports.moment = moment;

// 开放静态资源文件
app.use(express.static(path.join(__dirname,'public')))

// 获取配置信息
console.log(config.get('title'))
// 判断生产环境还是开发环境
if (process.env.NODE_ENV == 'development') {
    console.log('当前是开发环境');
    // morgan是中间件方法，在app.use中调用,dev是固定写法
    app.use(morgan('dev'))
}else {
    console.log('当前是生产环境');
}

// 引入路由对象
const home = require('./route/home');
const admin = require('./route/admin');

// 拦截请求 判断是否登录
app.use('/admin',require('./middleware/loginGuard'))
// 为路由对象匹配一级请求路径
app.use('/home',home);
app.use('/admin',admin);
// 错误处理中间件
app.use((err,req,res,next) => {
    // err就是next({})传入的参数，只能传递字符串参数
    let result = JSON.parse(err)
    // 对result中参数进行拼接
    let params = [];
    for ( let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
        }
    }
    res.redirect(`${result.path}?${params.join('&')}`)
})


// 监听端口
app.listen(80);
console.log('网站服务器启动成功');