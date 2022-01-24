module.exports = (req,res) => {
    // 开放一个标识符，判断当前链接为文章管理页面，给按钮添加选中状态
    req.app.locals.currentLink = 'article';
    res.render('admin/article-edit')
}