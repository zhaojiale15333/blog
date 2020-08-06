const mongoose = require('mongoose')
// 生成表结构
module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})