const guard = (req,res,next) => {
    // 判断用户是否为登录页面
    // 不是登录页面，判断是否登录
    // 如果未登录，重定向到登录页面
    // 如果登录 请求放行
    if ( req.url != '/login' && !req.session.username){
        res.redirect('/admin/login');
    }else {
    // 如果登录 请求放行
        next();
    }
}
module.exports = guard;