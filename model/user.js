// 引入mongoose
const mongoose = require('mongoose');
// 引入加密模块
const bcrypt = require('bcrypt');
// 引入Joi模块
const Joi = require('joi');

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
        // admin 超级管理员
        // nomral 普通用户
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

// 初始化一个用户
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
}
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
// createUser();

// 开放用户集合对象
module.exports = {
    User,
    validateUser
}