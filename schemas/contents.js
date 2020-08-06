const mongoose = require('mongoose')
// 生成表结构
module.exports = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        // 引用
        ref: 'Category'
    },
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // 引用
        ref: 'User'
    },
    addtime: {
        type: Date,
        default: new Date()
    },
    view: {
        type: Number,
        default: 0
    }
    ,
    description: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    comment: {
        type: Array,
        default: []
    }
})