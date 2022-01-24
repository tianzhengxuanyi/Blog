// 导入用户集合构造函数
const {User} = require('../../model/user');
// 导入加密模块
const bcrypt = require('bcrypt');
module.exports = async (req,res,next) => {
    // 接受表单参数
    const { username, email, role, state, password} = req.body;
    // 修改用户的id
    const id = req.query.id
    // 4. 根据id查询用户信息，并将客户端传递过来的密码和数据库中的密码进行比对
    let user = await User.findOne({_id:id})
    // 密码比对
    const isValid = await bcrypt.compare(password,user.password);
    if (isValid) {
        // 6. 如果密码对比成功，将用户信息更新到数据库中
        await User.updateOne({_id:id},{
            username: username,
            email: email,
            role: role,
            state: state
        }) 
        // 重定向到用户列表页面
        res.redirect('/admin/user')
    }else {
        // 5. 如果比对失败，对客户端做出响应
        // 使用错误处理中间件进行，对其进行完善
        return next(JSON.stringify({
            path: '/admin/user-edit',
            msg: '密码错误，无法修改用户信息',
            id: id
        }))
        // res.send('失败')
    }
}