// 导入User构造函数
const {User} = require('../../model/user');
module.exports = async (req,res) => {
    // 开放一个标识符，判断当前链接为用户管理页面，给按钮添加选中状态
    req.app.locals.currentLink = 'user';
    // 根据是否传递id值判断是修改还是添加
    // 接受请求参数传来的错误信息，渲染到页面中
    let {msg,id} = req.query;
    if (id) {
        // 修改操作
        // 查找当前用户信息
        let user = await User.findOne({_id:id});
        res.render('admin/user-edit',{
            msg: msg,
            user: user,
            link: '/admin/user-modify?id=' + id,
            button: '修改'
        });
    }else {
        // 添加操作
        res.render('admin/user-edit',{
            msg: msg,
            link: '/admin/user-edit',
            button: '提交'
        });
    }
}