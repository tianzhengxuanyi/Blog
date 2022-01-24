// 引入User对象
const { User } = require('../../model/user');
// 引入加密模块
const bcrypt = require('bcrypt');
module.exports = async (req,res) =>  {
    //接受客户端post来的参数，使用bodypaser模块
    const {email,password} = req.body;
    // 服务器端验证邮箱密码是否填写
    if ( email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        // return res.status(400).send('<h4>邮箱或者密码错误</h4>')
    }
    // 根据邮箱地址查询用户信息
    let user = await User.findOne({email});
    if (user) {
        // 用户存在,对比密码
        // 对比加密后的密码
        let isValid =await bcrypt.compare(password,user.password)
        if ( isValid ) {
            // 将用户信息添加到session中
            req.session.username = user.username;
            // 将用户信息添加到全局，这样所有的art文件都能使用
            // req下也有app对象，就是app.js中创建的app
            req.app.locals.userInfo = user;
            // 密码对比成功
            // 如果是普通用户跳转到博客展示首页，超级管理员重定向到用户管理页面
            if ( user.role == 'admin') {
                res.redirect('/admin/user');
            }else {
                res.redirect('/home/');
            }
        }else {
            // 密码比对不成功
            return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        }
    }else {
        // 用户不存在
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
    }
}