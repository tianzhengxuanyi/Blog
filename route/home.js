// 引用express框架
const express = require('express');

// 创建博客展示页面路由
const home = express.Router();

// 在home路由下挂载二级路由
// 创建博客展示首页路由
home.get('/',require('./home/index'));
// 创建博客详情页面路由
home.get('/article',require('./home/article'));
// 创建文章评论功能路由
home.post('/comment',require('./home/comment'))
// 将路由对象作为模块成员导出，在app.js中引入
module.exports = home;