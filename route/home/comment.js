// 引入评论集合构造函数
const { Comment } = require('../../model/comment');
module.exports = async (req,res) => {
    comment = req.body;
    comment.time = new Date();
    aid = req.body.aid;
    // res.send(comment);
    // res.send(req.body);
    // 将评论信息存储在评论集合中
    await Comment.create(comment);
    // 将页面重定向回文章详情页面
    res.redirect('/home/article?id=' + aid)
}