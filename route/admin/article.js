// 导入文章集合构造函数
const { Article } = require('../../model/article');
// 导入分页模块
const pagination = require('mongoose-sex-page');
module.exports = async (req,res) => {
    // 开放一个标识符，判断当前链接为文章管理页面，给按钮添加选中状态
    req.app.locals.currentLink = 'article';
    // 获取点击传递的页码
    let page =  req.query.page || 1;
    // populate关联查询，lean方法是告诉mongoose返回的是普通对象
    let articles = await pagination(Article).find({}).page(page).size(5).display(3).populate('author').exec();
    // let articles = await Article.find().populate('author').lean();
    // res.send(articles);
    // temp = {"page":1,"size":2,"total":12,"records":[{"_id":"61eb9c8727947a6181d7d4b9","title":"title11","author":{"_id":"61ea47f4a5909425f18125bb","username":"lishiqing","email":"lishiqing@qq.com","password":"$2b$10$lprS1XHXMSNGFmWSPvk7FO5qU2X0QfFKqJnKfWTAeyZDxuL.VGjI6","role":"normal","state":0,"__v":0},"publishDate":"2022-01-28T00:00:00.000Z","cover":"\\upload\\e451ea63c267f27002a338300.jpg","content":"<p>顶顶顶顶顶大大大</p>","__v":0},{"_id":"61eb9ce835b236796b12f0a7","title":"Xie Fei","author":{"_id":"61ea47f4a5909425f18125bb","username":"lishiqing","email":"lishiqing@qq.com","password":"$2b$10$lprS1XHXMSNGFmWSPvk7FO5qU2X0QfFKqJnKfWTAeyZDxuL.VGjI6","role":"normal","state":0,"__v":0},"publishDate":"2022-01-12T00:00:00.000Z","cover":"\\upload\\acc0a50f2cd7db8837fc62900.jpg","content":"<p>恶女撒</p>","__v":0}],"pages":6,"display":[1,2,3]}
    res.render('admin/article.art',{
        articles: JSON.parse(JSON.stringify(articles))
    });
}