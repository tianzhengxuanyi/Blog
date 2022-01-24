// 导入用户集合构造函数
const {User} = require('../../model/user');
module.exports = async (req,res) => {
    // 开放一个标识符，判断当前链接为用户管理页面，给按钮添加选中状态
    req.app.locals.currentLink = 'user';
    // 获取当前页码
    let page = req.query.page || 1;
    // 设定每页展示数据条数
    let pageSize = 10;
    // 查询用户总数
    let count = await User.countDocuments({});
    // 计算总页数
    let total = Math.ceil( count / pageSize);

    // 查询所有用户数据
    let users = await User.find({}).limit(pageSize).skip(pageSize*(page -1));
    res.render('admin/user',{
        users: users,
        page: page,
        total: total
    });
}