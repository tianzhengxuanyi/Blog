// 引入文章集合构造函数
const { Article } = require('../../model/article');
// 引入评论集合构造函数
const { Comment } = require('../../model/comment');
module.exports = async (req,res) => {
    // 获取传递过来的id参数
    let id = req.query.id;
    let article = await Article.findOne({_id:id}).populate('author').lean();
    let comments = await Comment.find({aid:id}).populate('uid').lean();
    // return res.send(article);
    // return res.send(comments);
    res.render('home/article',{
        article,
        comments
    });
}