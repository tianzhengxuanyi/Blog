module.exports = (req,res) => {
    // 删除session的方法，传入回调函数
    req.session.destroy(() => {
        // 删除cookie,传入要删除的cookie的名称
        res.clearCookie('connect.sid')
        // 删除userInfo信息
        req.app.locals.userInfo = null;
        // 重定向到登录页面
        res.redirect('/admin/login');
    })
}