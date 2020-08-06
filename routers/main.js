const express = require('express')
const router = express.Router()//路由对象
const Category = require('../models/Category')
const Content = require('../models/Content')
let result = []
Category.find().then(res => {
    result = res
})
router.get('/', (req, res) => {
    var FL = req.query.FL
    var where = {}
    if (FL) {
        where.category = FL
    }
    // 页数
    var page = Number(req.query.page || 1)
    // 几页一分
    var limit = 2
    // 忽略的个数
    var skip = (page - 1) * limit
    // 总页数
    var pages = 0

    Content.where(where).count().then((num) => {
        // 计算总页数
        pages = Math.ceil(num / limit)

        // 取值不能小于1
        page = Math.max(page, 1)
        // 取值不超过pages(总页数)
        if (page > pages) {
            page = pages
        }

        // sort:1升序，-1降序
        Content.where(where).find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['user', 'category']).then((contents) => {
            res.render('main/index', {
                userInfo: req.cookiesInfo,
                contents: contents,
                count: num,
                limit,
                pages,
                page,
                datas: result,
                title: '/',
                FL

            })
        })
    })
})


router.get('/view', (req, res) => {
    let { content_id } = req.query
    // 页数
    var page = Number(req.query.page || 1)
    // 几页一分
    var limit = 2
    // 忽略的个数
    var skip = (page - 1) * limit
    // 总页数
    var pages = 0

    Content.findOne({ _id: content_id }).then(content => {
        // 阅读数增加
        // 计算总页数
        pages = Math.ceil(content.comment.length / limit)
        // 取值不能小于1
        page = Math.max(page, 1)
        // 取值不超过pages(总页数)
        if (page > pages) {
            page = pages
        }
        content.view++;
        content.save()
        res.render('main/view', {
            userInfo: req.cookiesInfo,
            datas: result,
            content,
            page: page,
            pages: pages
        })
    })
})







module.exports = router