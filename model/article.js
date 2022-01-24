// 引入mongoose
const mongoose = require('mongoose');
// 创建文章集合规则
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: [true,'请填写文章标题']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'请填写作者']
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    cover: {
        type: String,
        default: null
    },
    content: {
        type: String,
    },
})
// 创建文章集合
const Article = mongoose.model('Article',articleSchema);

module.exports = {
    Article: Article,
}