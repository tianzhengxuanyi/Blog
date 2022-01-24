const {User} = require('../../model/user')
module.exports = async (req,res) => {
    // 接收客户端传递过来的id参数
    // res.send(req.query.id)
    // 根据id删除用户
    await User.findOneAndDelete({_id:req.query.id});
    // 重定向会user页面
    res.redirect('/admin/user');
}