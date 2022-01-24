// 引入formidable第三方模块
const formidable = require('formidable');
const path = require('path');
// 导入文章集合构造函数
const { Article } = require('../../model/article');
module.exports = (req,res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm({multiples:true,uploadDir:path.join(__dirname,'../../','public','upload'),keepExtensions:true});
    // 2.配置上传文件存放位置
    // form.uploadDir = path.join(__dirname,'../../','public','upload');
    // 3.保留上文件的后缀
    // form.keepExtensions = true;
    // 4.解析表单
    form.parse(req,async (err,fields,files) => {
        // err错误对象，如果表单解析失败则储存错误信息，否则为null
        // fields对象类型 为普通表单数据
        // files对象类型 上传二进制文件的相关信息
        // res.send(fields)
        await Article.create({
            title: fields.title,
            author: fields.author,
            publishDate: fields.publishDate,
            cover: files.cover.filepath.split('public')[1],
            content: fields.content
        });
        res.redirect('/admin/article');

    })
}