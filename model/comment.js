// 引入mongoose
const mongoose = require('mongoose');
const { Article } = require('./article');
const { User } = require('./user');

// 创建评论集合规则
const commentSchema = mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    content: {
        type: String,
    },
    time: {
        type: Date,
        default: new Date()
    }
});
// 创建Comment集合
const Comment = mongoose.model('Comment',commentSchema);
module.exports = {
    Comment
}
