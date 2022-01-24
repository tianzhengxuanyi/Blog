// 引用express框架
const express = require('express');

// 创建博客展示页面路由
const admin = express.Router();

// 在home路由下挂载二级路由,渲染登录页面
admin.get('/login',require('./admin/loginPage'));
// 实现登录功能
admin.post('/login',require('./admin/login'));
// 实现退出功能
admin.get('/logout',require('./admin/logout'));
// 创建用户列表页面路由
admin.get('/user',require('./admin/userPage'));
// 创建用户管理页面路由
admin.get('/user-edit',require('./admin/user-edit'));
// 接受用户管理页面添加用户表单数据
admin.post('/user-edit',require('./admin/user-edit-fn'));
// 创建用户修改路由
admin.post('/user-modify',require('./admin/user-modify'));
// 创建用户删除路由
admin.get('/user-delete',require('./admin/user-delete'));
// 创建文章列表页面路由
admin.get('/article',require('./admin/article'));
// 创建文章管理页面路由
admin.get('/article-edit',require('./admin/article-edit'));
// 创建文章添加功能路由
admin.post('/article-add',require('./admin/article-add'));



// 将路由对象作为模块成员导出，在app.js中引入
module.exports = admin;