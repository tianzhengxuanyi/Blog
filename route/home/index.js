// 引入文章集合构造函数
const { Article } = require('../../model/article');
// 分页模块
const pagination = require('mongoose-sex-page');
module.exports = async (req,res) => {
    // 获取page参数
    let page = req.query.page;
    let result = await pagination(Article).page(page).size(6).display(5).find().populate('author').exec();
    // return res.send(result)
    res.render('home/default',{
        result: JSON.parse(JSON.stringify(result))
    });
}