# 博客项目
## 1.1 项目介绍
1. 博客内容展示
- 1.1 文章列表页面
-    查询博客并展示
-   分页功能
- 1.2 文章详情页面
- 根据文章id查询并展示
- 用户评论（需登录）并展示
2. 博客管理功能
- 2.1 登录页面（验证成功）
- 2.2 用户管理页面
-   展示所有用户
-   增删改查功能
- 2.3 文章管理页面

## 1.2 案例初试化
1. 建立项目所需文件夹
- public 静态资源
- model 数据库操作
- route 路由
- views 模板
2. 初始化项目描述文件
在命令行工具中输入npm init -y
3. 下载项目所需第三方模块
npm install express mongoose art-template express-art-template
4. 创建网站服务器
- 创建app.js，作为文件的主入口
```js
// 引用express框架，创建网络服务器
const express = require('express');
// 创建服务器
const app = express();

// 监听端口
app.listen(80);
console.log('网站服务器启动成功');
```
5. 构建模块化路由
- 在route文件建立home、admin.js文件作为两个页面的路由
```js
// 引用express框架
const express = require('express');

// 创建博客展示页面路由
const home = express.Router();

// 在home路由下挂载二级路由
home.get('/',(req,res) => {
    res.send('欢迎来到博客展示首页')
});
// 将路由对象作为模块成员导出，在app.js中引入
module.exports = home;
```
- 在app.js中引入路由模块，并匹配一级路径
```js
// 引入路由对象
const home = require('./route/home');
const admin = require('./route/admin');

// 为路由对象匹配一级请求路径
app.use('/home',home);
app.use('/admin',admin);
```
6.  构建博客管理页面模板
- 在app.js中开放静态资源（css、js、img）
```js
// 处理路径
const path = require('path');
// 开放静态资源文件
// 需要绝对路径
app.use(express.static(path.join(__dirname,'public')))
```

- 将HTML动态文件放在views文件夹中，并创建home和admin文件夹分别放置各自页面。将HTML后缀名改为art。 

- 渲染模板
```js
// app.js
// 配置express框架模板所在位置
// set中第一个参数是固定好的，第二个参数为模板绝对路径
app.set('views',path.join(__dirname,'views'));
// 配置express框架模板的默认后缀
// app.set(固定,模板后缀);
app.set('view engine','art');
// 配置渲染art后缀的模板引擎
// app.engine('模板后缀',require('模板引擎'));
app.engine('art',require('express-art-template'));
```
```js
//admin.js
admin.get('/login',(req,res) => {
    // 已在app.js中配置路径和后缀，否则要写绝对路径
    res.render('admin/login')
})
```
- 模板文件中的相对路径，相对的是浏览器地址栏中的地址（浏览器地址栏最后一个默认为文件名，所以从倒数第二个算起），这样就不安全。要将所有模板文件的相对路径改为绝对路径（'/'表示绝对路径，如'/admin/css/base.css')

- 优化模板，将HTML骨架和公共部分抽离。在views admin文件夹下建立common文件夹，并生成header和aside.art文件作为抽取的公共头部和侧边栏。在原本art文件中引入公共部分
```js
// 头部部分
// 这里由模板引擎解析，相对路径相对的为当前文件。
{{include './common/header.art'}}
// 侧边栏部分
{{include './common/aside.art'}}
```
抽取HTML骨架，在common文件夹中创建layout.art文件，放置骨架
```html
<!-- 抽离layout骨架，并预留坑位 -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title>Blog - Content Manager</title>
    <link rel="stylesheet" href="/admin/lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="/admin/css/base.css">
    {{block 'link'}}{{/block}}
</head>

<body>
    {{block 'main'}}{{/block}}
    <script src="/admin/lib/jquery/dist/jquery.min.js"></script>
    <script src="/admin/lib/bootstrap/js/bootstrap.min.js"></script>
    {{block 'script'}}{{/block}}
</body>

</html>
```
原本模板文件中继承layout.art骨架，并将剩余部分用block标签包裹填坑
```html
// 继承骨架
{{extend './common/layout.art'}}
{{block 'main'}}
    <!-- 头部 -->
    {{include './common/header.art'}}
    <!-- /头部 -->
    <!-- 主体内容 -->
    <div class="content">
    </div>
    <!-- /主体内容 -->
{{/block}}
{{block 'script'}}
    <script src="/admin/lib/ckeditor5/ckeditor.js"></script>
{{/block}}
```

## 2.项目功能实现
### 2.1 登录
1. 创建用户集合，初始化用户
    - 连接数据库,创建connect.js文件
    - 创建user.js文件,创建用户集合
    - 初始化用户
连接数据库,创建connect.js文件
```js
// 引入mongoose库
const mongoose = require('mongoose');
// 连接数据库
mongoose.connect('mongodb://localhost/blog')
    .then(() => {console.log('数据库连接成功')})
    .catch(() => {console.log('数据库连接失败')})
```
在app.js引入数据库连接文件
```js
// 引入数据库连接
require('./model/connect')
```

创建user.js文件,创建用户集合
```js
// 引入mongoose
const mongoose = require('mongoose');
// 创建用户集合规则
const userSchame = mongoose.Schema({
    username: {
        type:String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type:String,
        // 保证邮箱唯一，数据库存在就无法插入
        unique: true,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    role: {
        type:String,
        required: true
    },
    state: {
        type:Number,
        // 0启用状态
        // 1禁用状态
        default: 0
    },
})

// 创建用户集合
const User = mongoose.model('User',userSchame)

// 开放用户集合对象
module.exports = {
    User
}
```
初始化一个用户，支撑登录功能测试
```js
// 初始化一个用户
User.create({
    username: 'iteheima',
    email: 'iteheima@itcast.cn',
    password: '123456',
    role: 'admin',
    state: 0
})
```

2. 为登录表单项设置请求地址、请求方式以及表单项name属性
在public admin js 下新建common.js文件写入如下代码
```js
// 将表单中输入值转换为json格式
function serializeToJson(form){
    var result = {};
    // 将表单输入的内容转换为数组
    var f = form.serializeArray();
    f.forEach(function(item) {
        result[item.name] = item.value;
    })
    return result;
} 
```
在login.art中引入common.js，并获取表单填写数据，阻止表单默认提交行为
```js
<script src="/admin/js/common.js"></script>
<script>
    $('#loginForm').on('submit',function(){
        var result = serializeToJson($(this));
        console.log(result)
        // 阻止表单默认提交事件
        return false;
    })
</script>
```
3. 当用户点击登录按钮，客户端验证用户是否填写了表单
4. 如果其中一项没有输入，阻止表单提交
```js
    <script>
        $('#loginForm').on('submit',function(){
            var result = serializeToJson($(this));
            // 验证邮箱是否输入
            if (result.email.trim().length == 0) {
                alert('请输入邮箱');
                // 阻止表单默认提交事件
                return false;
            }
            // 验证密码是否输入
            if ( result.password.trim().length == 0) {
                alert('请输入密码');
                return false;
            }
        })
    </script>
```
5. 服务器接收请求参数，验证用户是否填写了登录表单
在admin路由中接受参数
```js
// 实现登录功能
admin.post('/login',(req,res) => {
    //接受客户端post来的参数，使用bodypaser模块
    res.send(req.body) 
})
```
用body-parser接受post参数，全局配置。body-parser会在req下面添加body属性，里面为post参数。
```js
// app.js
// 引入body-parser，处理post参数
const bodyParser = require('body-parser');
// 处理post请求参数
// 使用app.use拦截所有请求交给bodyParser中的urlencoded处理。
app.use(bodyParser.urlencoded({extended: false}))
```
6. 如果其中一项没有输入，为客户端做出相应，阻止程序向下执行
```js
// 实现登录功能
admin.post('/login',(req,res) => {
    //接受客户端post来的参数，使用bodypaser模块
    const {email,password} = req.body;
    // 服务器端验证邮箱密码
    if ( email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        // return res.status(400).send('<h4>邮箱或者密码错误</h4>')
    }
})
```
```html
// 继承骨架
{{extend './common/layout.art'}}
{{block 'main'}}
	<p class="bg-danger error">{{msg}}</p>
{{/block}}
{{block 'script'}}
	<script type="text/javascript">
		setTimeout(function () {
			location.href = '/admin/login';
		}, 3000)
	</script>
{{/block}}
```
7. 根据邮箱地址查询用户信息
首先在app.js中引入数据库user对象
```js
// 引入数据库user对象
const {User} = require('./model/user');
```
8. 如果用户不存在，为客户端做出相应，阻止程序向下执行
9. 如果用户存在，将用户名和密码进行比对
10. 比对成功，用户登录成功
11. 比对失败，用户登录失败
将用户信息添加到全局，这样所有的art文件都能使用，req下也有app对象，就是app.js中创建的app。然后在common header中替换用户名为{{userInfo.username}}
```js
// admin.js
// 实现登录功能
admin.post('/login',async (req,res) =>  {
    //接受客户端post来的参数，使用bodypaser模块
    const {email,password} = req.body;
    // 服务器端验证邮箱密码是否填写
    if ( email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        // return res.status(400).send('<h4>邮箱或者密码错误</h4>')
    }
    // 根据邮箱地址查询用户信息
    let user = await User.findOne({email});
    if (user) {
        // 用户存在,对比密码
        // 对比加密后的密码
        let isValid =await bcrypt.compare(password,user.password)
        if ( isValid ) {
            // 将用户信息添加到session中
            req.session.username = user.username;
            // 将用户信息添加到全局，这样所有的art文件都能使用
            // req下也有app对象，就是app.js中创建的app
            req.app.locals.userInfo = user;
            // 密码对比成功，重定向到用户管理页面
            res.redirect('/admin/user');
        }else {
            // 密码比对不成功
            return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        }
    }else {
        // 用户不存在
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
    }
})
```
12. 保存登录状态
```js
// app.js
// 引入express-session，创建session
const session = require('express-session');
// 配置session
app.use(session({
    // 对cookie进行加密的秘钥
    secret:'secrit key',
    // 当cookie被删除不会保留初始化的值
    saveUninitialized: false,
    // 设置cookie的过期时间，单位为毫秒
    cookie: {
        maxAge: 24*60*60*1000
    }
}));

// admin.js
// 将用户信息添加到session中
req.session.username = user.username;
```
13. 密码加密处理 
```js
// 引入加密模块
const bcrypt = require('bcrypt');
// 初始化一个用户,genSalt and hash都是返回的是promise对象，所以要在异步函数里面使用await关键字获取返回值
async function createUser() {
    // 生成盐salt
    const salt = await bcrypt.genSalt(10);
    // 对密码加密
    const pwd = await bcrypt.hash('123456',salt);
    User.create({
        username: 'itheima',
        email: 'itheima@itcast.cn',
        password: pwd,
        role: 'admin',
        state: 0
    })
    // 对比加密后的密码
    let isValid =await bcrypt.compare(password,user.password)
}
createUser();
```
14. 登录拦截
拦截所有访问页面的请求判断是否登录，如果未登录重定向到登录页面
```js
// 拦截请求 判断是否登录
app.use('/admin',(req,res,next) => {
    // 判断用户是否为登录页面
    // 不是登录页面，判断是否登录
    // 如果未登录，重定向到登录页面
    // 如果登录 请求放行
    console.log(req.url);
    if ( req.url != '/login' && !req.session.username){
        res.redirect('/admin/login');
    }else {
    // 如果登录 请求放行
        next();
    }
})
```
15. 退出功能
    - 点击退出按钮
```html
 <li><a href="/admin/logout">退出登录</a></li>
```
    - 删除cookie、session，重定向到登录页面
```js
// 实现退出功能
admin.get('/logout',(req,res) => {
    // 删除session的方法，传入回调函数
    req.session.destroy(() => {
        // 删除cookie,传入要删除的cookie的名称
        res.clearCookie('connect.sid')
        // 重定向到登录页面
        res.redirect('/admin/login');
    })
})
```

16. 优化代码
将app.use中的回调函数抽离出来，app.js文件中只实现模块的引入和路由。在根目录下创建middleware文件夹，创建loginGuard.js将登录拦截的函数剪切到这，并导出
```js
// loginGuard.js
const guard = (req,res,next) => {
    // 判断用户是否为登录页面
    // 不是登录页面，判断是否登录
    // 如果未登录，重定向到登录页面
    // 如果登录 请求放行
    console.log(req.url);
    if ( req.url != '/login' && !req.session.username){
        res.redirect('/admin/login');
    }else {
    // 如果登录 请求放行
        next();
    }
}
module.exports = guard;

// app.js
// 拦截请求 判断是否登录
app.use('/admin',require('./middleware/loginGuard'))
```
路由中的功能实现函数也要抽离，在route文件夹下新建admin文件夹存放抽离的路由实现函数。如登录功能
```js
// login.js

// 引入User对象
// 要更改文件路径，因为所在文件不一样
const { User } = require('../../model/user');
// 引入加密模块
const bcrypt = require('bcrypt');
module.exports = async (req,res) =>  {
    //接受客户端post来的参数，使用bodypaser模块
    const {email,password} = req.body;
    // 服务器端验证邮箱密码是否填写
    if ( email.trim().length == 0 || password.trim().length == 0) {
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        // return res.status(400).send('<h4>邮箱或者密码错误</h4>')
    }
    // 根据邮箱地址查询用户信息
    let user = await User.findOne({email});
    if (user) {
        // 用户存在,对比密码
        // 对比加密后的密码
        let isValid =await bcrypt.compare(password,user.password)
        if ( isValid ) {
            // 将用户信息添加到session中
            req.session.username = user.username;
            // 将用户信息添加到全局，这样所有的art文件都能使用
            // req下也有app对象，就是app.js中创建的app
            req.app.locals.userInfo = user;
            // 密码对比成功，重定向到用户管理页面
            res.redirect('/admin/user');
        }else {
            // 密码比对不成功
            return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
        }
    }else {
        // 用户不存在
        return res.status(400).render('admin/error',{msg:'邮箱或者密码错误'})
    }
}
```
### 2.2 新增用户
1. 为用户列表页面的新增用户按钮添加链接
```html
<a href="/admin/user-edit" class="btn btn-primary new">新增用户</a>
```
2. 添加一个连接对应的路由，在路由处理函数中渲染新增用户模板
```js
// 创建用户管理页面路由
admin.get('/user-edit',require('./admin/user-edit'));
// user-edit.js
module.exports = (req,res) => {
    res.render('admin/user-edit')
}
```
3. 为新增用户表单指定请求地址、请求方式、为表单项添加name属性
4. 增加实现添加用户的功能路由
```js
// admin.js
// 接受用户管理页面添加用户表单数据
admin.post('/user-edit',require('./admin/user-edit-fn'));
```
5. 接收到客户端传递过来的请求参数
6. 对请求参数的格式进行验证,不成功就携带错误信息重定向会user-edit
安装Joi模块进行验证，npm install joi@14.3.1
```js
// user-edit-fn.js
// 引入Joi模块
const Joi = require('joi');
module.exports = async (req,res) => {
    // 对请求参数的格式进行验证
    // 设定验证规则
    const schema = {
        username: Joi.string().min(2).max(15).required().error(new Error('用户名不符合要求')),
        email: Joi.string().email().required().error(new Error('邮箱格式不正确')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().error(new Error('密码格式不正确')),
        role: Joi.string().valid('admin','normal').required().error(new Error('角色值非法')),
        state: Joi.number().valid(0,1).required().error(new Error('状态值非法'))
    }
    try {
        // 对请求参数格式验证
        // 如果验证不成功会报错
        await Joi.validate(req.body,schema);
    } catch (e) {
        // 不成功就携带错误信息重定向会user-edit
        return res.redirect(`/admin/user-edit?msg=${e.message}`)
    }

    // res.send(req.body);
}
```
7. 验证当前要注册的邮箱地址是否已经注册过
```js
// user-edit-fn.js
// 引入User构造函数
const { User } = require('../../model/user');
// 验证当前要注册的邮箱地址是否已经注册过
    let user = await User.findOne({email:req.body.email});
    console.log(user);
    if ( user ) {
        // 邮箱已经被注册，重定向回页面并提示
        return res.redirect(`/admin/user-edit?msg=邮箱已被注册`)
    }
```
8. 对密码进行加密处理
9. 将用户信息添加到数据库中
10. 重定向页面到用户列表页面
```js
// user-edit-fn.js
// 引入加密模块
const bcrypt = require('bcrypt');
// 未被注册则对密码进行加密处理
// 生成salt
let salt = await bcrypt.genSalt(10);
// 对密码加密
req.body.password = await bcrypt.hash(req.body.password,salt);
// 将数据插入数据库
User.create(req.body);
// 插入成功就跳转到user
return res.redirect('/admin/user')
```
11. 代码优化
将验证数据格式的代码抽取到model user.js中
```js
// user.js
const validateUser = user => {
    // 设定验证规则
    const schema = {
        username: Joi.string().min(2).max(15).required().error(new Error('用户名不符合要求')),
        email: Joi.string().email().required().error(new Error('邮箱格式不正确')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().error(new Error('密码格式不正确')),
        role: Joi.string().valid('admin','normal').required().error(new Error('角色值非法')),
        state: Joi.number().valid(0,1).required().error(new Error('状态值非法'))
    }
    return Joi.validate(user,schema);
} 
// 开放用户集合对象
module.exports = {
    User,
    validateUser
}

// user-edit-fn.js
// 引入User构造函数
const { User, validateUser } = require('../../model/user');

// 如果验证不成功会报错
await validateUser(req.body);
```

将错误处理交给错误处理中间件
```js
// app.js
// 错误处理中间件
app.use((err,req,res,next) => {
    // err就是next({})传入的参数，只能传递字符串参数
    let result = JSON.parse(err)
    res.redirect(`${result.path}?msg=${result.msg}`)
})

// user-edit-fn.js
// 对请求参数的格式进行验证
try {
    // 对请求参数格式验证
    // 如果验证不成功会报错
    await validateUser(req.body);
} catch (e) {
    // 不成功就携带错误信息重定向会user-edit
    return next(JSON.stringify({path:'/admin/user-edit',msg:e.message}));
}

// 验证当前要注册的邮箱地址是否已经注册过
let user = await User.findOne({email:req.body.email});
if ( user ) {
    // 邮箱已经被注册，重定向回页面并提示
    return next(JSON.stringify({path:'/admin/user-edit',msg:'邮箱已被注册'}));
}
```


### 2.3 数据分页
1. 查询数据库，并将数据传递到模板文件中，渲染 
```js
// userPage.js
// 导入用户集合构造函数
const {User} = require('../../model/user');
module.exports = async (req,res) => {
    // 查询所有用户数据
    let users = await User.find({});
    res.render('admin/user',{users})
}
```
```html
<!-- user.art -->
{{each users}}
<tr>
    <td>{{@$value._id}}</td>
    <td>{{$value.username}}</td>
    <td>{{$value.email}}</td>
    <td>{{$value.role == 'admin' ? '超级管理员' : '普通用户'}}</td>
    <td>{{$value.state == 0 ? '启用' : '禁用'}}</td>
    <td>
        <a href="user-edit.html" class="glyphicon glyphicon-edit"></a>
        <i class="glyphicon glyphicon-remove" data-toggle="modal" data-target=".confirm-modal"></i>
    </td>
</tr>
{{/each}}
```

2. 分页功能核心要素：
- 当前页，用户通过点击上一页或者下一页或者页码产生，客户端通过get参数方式传递到服务器端
- 总页数，根据总页数判断当前页是否为最后一页，根据判断结果做响应操作
```js
// userPage.js
// 导入用户集合构造函数
const {User} = require('../../model/user');
module.exports = async (req,res) => {
    // 获取当前页码
    let page = req.query.page || 1;
    // 设定每页展示数据条数
    let pageSize = 10;
    // 查询用户总数
    let count = await User.countDocuments({});
    // 计算总页数
    let total = Math.ceil( count / pageSize);

    // 查询所有用户数据
    let users = await User.find({}).limit(pageSize).skip(pageSize*(page -1));
    res.render('admin/user',{
        users: users,
        page: page,
        total: total
    });
}
```
```html
<!-- user.art -->
<!-- /内容列表 -->
<!-- 分页 -->
<ul class="pagination">
    <li style="display: {{page - 1 < 1 ? 'none' : 'inline'}}">
        <a href="/admin/user?page={{page - 1}}">
        <span>&laquo;</span>
        </a>
    </li>
    <% for (var i = 1; i <= total; i++) { %>
    <li><a href="/admin/user?page=<%=i%>">{{i}}</a></li>
    <% } %>
    <li style="display: {{page - 0 + 1 > total ? 'none' : 'inline'}}">
        <a href="/admin/user?page={{page - 0 + 1}}">
        <span>&raquo;</span>
        </a>
    </li>
</ul>
<!-- /分页 -->
```

### 2.4 用户信息修改
用户修改和添加公用一个页面渲染路由，根据请求是否传递id参数判断
```js
// 导入User构造函数
const {User} = require('../../model/user');
module.exports = async (req,res) => {
    // 根据是否传递id值判断是修改还是添加
    // 接受请求参数传来的错误信息，渲染到页面中
    let {msg,id} = req.query;
    if (id) {
        // 修改操作
        // 查找当前用户信息
        let user = await User.findOne({_id:id});
        res.render('admin/user-edit',{
            msg: msg,
            user: user,
            // 表单提交的地址不同
            link: '/admin/user-modify',
            button: '修改'
        });
    }else {
        // 添加操作
        res.render('admin/user-edit',{
            msg: msg,
            link: '/admin/user-edit',
            button: '提交'
        });
    }
}
```
渲染页面
```html
<form class="form-container" method="post" action="{{link}}">
    <div class="form-group">
        <label>用户名</label>
        <input value="{{user && user.username}}" name="username" type="text" class="form-control" placeholder="请输入用户名">
    </div>
    <div class="form-group">
        <label>邮箱</label>
        <input value="{{user && user.email}}" name="email" type="email" class="form-control" placeholder="请输入邮箱地址">
    </div>
    <div class="form-group">
        <label>密码</label>
        <input  name="password" type="password" class="form-control" placeholder="请输入密码">
    </div>
    <div class="form-group">
        <label>角色</label>
        <select name="role" class="form-control">
            <option value="normal" {{ user && user.role == "normal" ? "selected" : ""}}>普通用户</option>
            <option value="admin" {{ user && user.role == "admin" ? "selected" : ""}}>超级管理员</option>
        </select>
    </div>
    <div class="form-group">
        <label>状态</label>
        <select name="state" class="form-control">
            <option value="0" {{ user && user.state == "0" ? "selected" : ""}}>启用</option>
            <option value="1" {{ user && user.state == "1" ? "selected" : ""}}>禁用</option>
        </select>
    </div>
    <div class="buttons">
        <input type="submit" class="btn btn-primary" value="{{button}}">
    </div>
</form>
```
1. 将要修改的用户ID传递到服务器端
```js
// user-edit.js
res.render('admin/user-edit',{
    msg: msg,
    user: user,
    link: '/admin/user-modify?id' + id,
    button: '修改'
});
```
2. 建立用户信息修改功能对应的路由
```js
// admin.js
// 创建用户修改路由
admin.post('/user-modify',require('./admin/user-modify'));
```
3. 接收客户端表单传递过来的请求参数 
4. 根据id查询用户信息，并将客户端传递过来的密码和数据库中的密码进行比对
5. 如果比对失败，对客户端做出响应
6. 如果密码对比成功，将用户信息更新到数据库中
```js
// user-modify.js
// 导入用户集合构造函数
const {User} = require('../../model/user');
// 导入加密模块
const bcrypt = require('bcrypt');
module.exports = async (req,res,next) => {
    // 接受表单参数
    const { username, email, role, state, password} = req.body;
    // 修改用户的id
    const id = req.query.id
    // 4. 根据id查询用户信息，并将客户端传递过来的密码和数据库中的密码进行比对
    let user = await User.findOne({_id:id})
    // 密码比对
    const isValid = await bcrypt.compare(password,user.password);
    if (isValid) {
        // 6. 如果密码对比成功，将用户信息更新到数据库中
        await User.updateOne({_id:id},{
            username: username,
            email: email,
            role: role,
            state: state
        }) 
        // 重定向到用户列表页面
        res.redirect('/admin/user')
    }else {
        // 5. 如果比对失败，对客户端做出响应
        // 使用错误处理中间件进行，对其进行完善
        return next(JSON.stringify({
            path: '/admin/user-edit',
            msg: '密码错误，无法修改用户信息',
            id: id
        }))
        // res.send('失败')
    }
}
```
完善错误处理中间件
```js
// app.js
// 错误处理中间件
app.use((err,req,res,next) => {
    // err就是next({})传入的参数，只能传递字符串参数
    let result = JSON.parse(err)
    // 对result中参数进行拼接
    let params = [];
    for ( let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
        }
    }
    res.redirect(`${result.path}?${params.join('&')}`)
})
```

### 2.5 用户信息删除
1. 在确认删除框中添加隐藏域用以存储要删除用户的ID值
2. 为删除按钮添自定义属性用以存储要删除用户的ID值
3. 为删除按钮添加点击事件，在点击事件处理函数中获取自定义属性中存储的ID值并将ID值存储在表单的隐藏域中
4. 为删除表单添加提交地址以及提交方式
```html
<!-- 详细代码见user.art -->
```
5. 在服务器端建立删除功能路由
```js
// admin.js
// 创建用户删除路由
admin.get('/user-delete',require('./admin/user-delete'));
```
6. 接收客户端传递过来的id参数
7. 根据id删除用户
 ```js
//  user-delete.js
const {User} = require('../../model/user')
module.exports = async (req,res) => {
    // 接收客户端传递过来的id参数
    // res.send(req.query.id)
    // 根据id删除用户
    await User.findOneAndDelete({_id:req.query.id});
    // 重定向会user页面
    res.redirect('/admin/user');
}
 ```

 ### 2.6 文章管理页面
1. 创建文章管理页面和编辑页面的路由
创建article.js和article-edit.js
2. 给文章管理添加链接
3. 选中文章管理页面按钮
改动见aside.art
4. 创建文章集合
model article.js
5. 给发布文章按钮添加请求地址
6. 为添加文章的表单给定name属性和请求方法、地址
见article.art
7. 接受二进制表单数据
```js
// article-edit.js
// 引入formidable第三方模块
const formidable = require('formidable');
const path = require('path');
module.exports = (req,res) => {
    // 1.创建表单解析对象
    const form = new formidable.IncomingForm({multiples:true,uploadDir:path.join(__dirname,'../../','public','upload'),keepExtensions:true});
    // 2.配置上传文件存放位置
    // form.uploadDir = path.join(__dirname,'../../','public','upload');
    // 3.保留上文件的后缀,这种方式似乎无效
    // form.keepExtensions = true;
    // 4.解析表单
    form.parse(req,(err,fields,files) => {
        // err错误对象，如果表单解析失败则储存错误信息，否则为null
        // fields对象类型 为普通表单数据
        // files对象类型 上传二进制文件的相关信息
        res.send(files);
    })
}
```
8. 填写作者id
```html
<!-- // article-edit.art -->
<!-- 登录成功后userInfo已开发 -->
<input name="author" type="text" class="form-control" readonly value="{{@userInfo._id}}">
```
9. 预览文件
```js
// article-edit.art
<script>
// 预览上传图片
// 获取控件和图片
var fileInp = document.querySelector('#fileInp');
var preview = document.querySelector('#preview');
// 给files添加change事件
fileInp.addEventListener('change',function() {
    // 获取文件列表
    console.log(this.files);
    // 创建文件读取对象
    var reader = new FileReader();
    // 读取数据，为异步方法
    reader.readAsDataURL(this.files[0]);
    // 获取读取结果要添加onload事件
    reader.addEventListener('load',function() {
        preview.src = reader.result;
    })
})
</script>
```
10. 获取上传文件的存储路径，转换为相对路径，存储到数据库
```js
// article-add.js
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
```

11. 文章列表页面数据展示
- 查询所有数据
- 链表查询
```js
// article.js
// 导入文章集合构造函数
const { Article } = require('../../model/article');
module.exports = async (req,res) => {
    // 开放一个标识符，判断当前链接为文章管理页面，给按钮添加选中状态
    req.app.locals.currentLink = 'article';
    // populate关联查询，lean方法是告诉mongoose返回的是普通对象
    let articles = await Article.find({}).populate('author').lean();
    res.render('admin/article',{
        articles: articles
    });
}
```
- 发布时间格式化
```js
// app.js
// 引入时间格式处理函数
const moment = require('moment');
// 引入art-template
const template = require('art-template');
// 将dateFormat方法添加到art-template中
template.defaults.imports.moment = moment;
```
```html
<!-- article.art -->
<td>{{moment($value.publishDate).format('YYYY-MM-DD')}}</td>
```
12. mongoose-sex-page分页
```js
// article.js
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
    // 返回的数据中_id的值似乎有问题是一个对象？
    res.render('admin/article.art',{
        articles: JSON.parse(JSON.stringify(articles))
    });
}
```
渲染模板代码见article.art

### 2.7 mongoDB数据库添加账号
1. 以系统管理员的方式运行powershell
2. 连接数据库 mongo
3. 查看数据库 show dbs
4. 切换到admin数据库 use admin
5. 创建超级管理员账户 db.createUser({user:'root',pwd:'root',roles:['root']})
6. 切换到blog数据 use blog
7. 创建普通账号 db.createUser({user:'',pwd:'',roles:['readWrite']})
8. 卸载mongodb服务
         1. 停止服务 net stop mongodb
         2. mongod --remove
9. 创建mongodb服务
          mongod --logpath="C:\Program Files\MongoDB\Server\4.1\log\mongod.log" --dbpath="C:\Program          Files\MongoDB\Server\4.1\data" --install –-auth
10. 启动mongodb服务 net start mongodb
11. 在项目中使用账号连接数据库
          mongoose.connect('mongodb://user:pass@localhost:port/database')

### 2.8 开发环境
 morgan将每次请求在命令行窗口打印
 npm install morgan
 ```js
 // 获取配置信息
console.log(config.get('title'))
// 判断生产环境还是开发环境
if (process.env.NODE_ENV == 'development') {
    console.log('当前是开发环境');
    // morgan是中间件方法，在app.use中调用,dev是固定写法
    app.use(morgan('dev'))
}else {
    console.log('当前是生产环境');
}
```

#### 第三方模块config
作用：允许开发人员将不同运行环境下的应用配置信息抽离到单独的文件中，模块内部自动判断当前应用的运行环境，
并读取对应的配置信息，极大提供应用配置信息的维护成本，避免了当运行环境重复的多次切换时，手动到项目代码
中修改配置信息
1. 使用npm install config命令下载模块
2. 在项目的根目录下新建config文件夹
3. 在config文件夹下面新建default.json、development.json、production.json文件
4. 在项目中通过require方法，将模块进行导入
5. 使用模块内部提供的get方法获取配置信息
```json
{
    "title":"博客管理项目 -----开发环境",
    "db": {
        "user":"itcast",
        "host":"localhost",
        "port":"27017",
        "name":"blog"
    }
}
```
```js
// 引入config模块
const config = require('config');
// 连接数据库
mongoose.connect(`mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`)
    .then(() => {console.log('数据库连接成功')})
    .catch(() => {console.log('数据库连接失败')})
```

将敏感配置信息存储在环境变量中
1. 在config文件夹中建立custom-environment-variables.json文件
2. 配置项属性的值填写系统环境变量的名字
3. 项目运行时config模块查找系统环境变量，并读取其值作为当前配置项属于的值
```json
{
    "db": {
        "pwd":"MONGODB_PWD"
    }
}
```

### 2.9 文章页面展示
1. 创建不同页面对应路由
2. 将页面链接换成绝对路径
3. 抽取骨架和公共部分
4. 从数据库查询文章数据，渲染到文章展示首页
5. 给文章添加链接，通过get参数传递文章id，然后通过id查询文章详情，展示在文章详情页面中

### 2.10 文章评论
1. 创建评论集合
```js
// model comment.js
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
```
2. 判断用户是否登录，如果用户登录，再允许用户提交评论表单（admin跳转到管理页面，normal跳转到首页）
```js
// route admin login.js
// 密码对比成功
// 如果是普通用户跳转到博客展示首页，超级管理员重定向到用户管理页面
if ( user.role == 'admin') {
    res.redirect('/admin/user');
}else {
    res.redirect('/home/');
}
```
3. 在服务器端创建文章评论功能对应的路由
```js
// route home.js
// 创建文章评论功能路由
home.post('/comment',require('./home/comment'))
```
4. 在路由请求处理函数中接收客户端传递过来的评论信息
5. 将评论信息存储在评论集合中
6. 将页面重定向回文章详情页面
```js
// route home comment.js
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
```
7. 在文章详情页面路由中获取文章评论信息并展示在页面中
见route home article.js,数据渲染和表单设置见article.art

### 2.11 文章管理页面的修改和删除功能