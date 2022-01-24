
// 引入User构造函数
const { User, validateUser } = require('../../model/user');
// 引入加密模块
const bcrypt = require('bcrypt');
module.exports = async (req,res,next) => {
    // 对请求参数的格式进行验证
    try {
        // 对请求参数格式验证
        // 如果验证不成功会报错
        await validateUser(req.body);
    } catch (e) {
        // 不成功就携带错误信息重定向会user-edit
        return next(JSON.stringify({path:'/admin/user-edit',msg:e.message}));
    }

    // 验证当前要注册的邮箱地址是否已经注册过
    let user = await User.findOne({email:req.body.email});
    if ( user ) {
        // 邮箱已经被注册，重定向回页面并提示
        return next(JSON.stringify({path:'/admin/user-edit',msg:'邮箱已被注册'}));
    }
    // 未被注册则对密码进行加密处理
    // 生成salt
    let salt = await bcrypt.genSalt(10);
    // 对密码加密
    req.body.password = await bcrypt.hash(req.body.password,salt);
    // 请数据插入数据库
    User.create(req.body);
    // 插入成功就跳转到user
    return res.redirect('/admin/user')
    // res.send(req.body);
}