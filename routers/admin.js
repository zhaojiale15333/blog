const express = require('express')
const User = require('../models/User')
const Category = require('../models/Category')
const Content = require('../models/Content')
const router = express.Router()//路由对象
// 判断是否为管理员
router.use((req, res, next) => {
    if (!req.cookiesInfo.isAdmin) {
        res.send('404···················')
        return
    }
    next()
})
router.get('/', (req, res) => {

    res.render('admin/index', {
        userInfo: req.cookiesInfo
    })

})
// 分页+用户展示
router.get('/user', (req, res) => {
    // 页数
    var page = Number(req.query.page || 1)
    // 几页一分
    var limit = 2
    // 忽略的个数
    var skip = (page - 1) * limit
    // 总页数
    var pages = 0
    User.count().then((num) => {
        // 计算总页数
        pages = Math.ceil(num / limit)
        // 取值不能小于1
        page = Math.max(page, 1)
        // 取值不超过pages(总页数)
        if (page > pages) {
            page = pages
        }

        User.find().limit(limit).skip(skip).then((user) => {
            res.render('admin/user_index', {
                userInfo: req.cookiesInfo,
                users: user,
                count: num,
                limit,
                pages,
                page,
                title: 'user'

            })
        })
    })

})
// 分类首页
router.get('/category', (req, res) => {
    // 页数
    var page = Number(req.query.page || 1)
    // 几页一分
    var limit = 2
    // 忽略的个数
    var skip = (page - 1) * limit
    // 总页数
    var pages = 0
    Category.count().then((num) => {
        // 计算总页数
        pages = Math.ceil(num / limit)
        // 取值不超过pages(总页数)
        if (page > pages) {
            page = pages
        }
        // 取值不能小于1
        page = Math.max(page, 1)

        // sort:1升序，-1降序
        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((category) => {
            res.render('admin/category_index', {
                userInfo: req.cookiesInfo,
                categorys: category,
                count: num,
                limit,
                pages,
                page,
                title: 'category'

            })
        })
    })
})
// 添加分类
router.get('/category/add', (req, res) => {
    res.render('admin/category_add', {
        userInfo: req.cookiesInfo,
    })
})
// 提交信息存入数据库
router.post('/category/add', (req, res) => {
    let { name } = req.body
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.cookiesInfo,
            mes: '提交内容为空',
        })
        return
    }
    Category.findOne({ name }).then(result => {
        if (result) {
            res.render('admin/error', {
                userInfo: req.cookiesInfo,
                mes: '提交的分类已存在',
            })
        } else {
            new Category({ name }).save().then(result => {
                res.render('admin/success', {
                    userInfo: req.cookiesInfo,
                    mes: '添加成功',
                    url: '/admin/category'
                })
            })
        }
    })
})
// 修改分类信息
router.get('/category/edit', (req, res) => {
    let { id } = req.query
    Category.findOne({ _id: id }).then(result => {
        res.render('admin/edit', {
            userInfo: req.cookiesInfo,
            result: result
        })
    })
})
// 修改分类
router.post('/category/edit', (req, res) => {
    let { id } = req.query
    let { name } = req.body

    Category.findOne({ _id: id }).then(result => {
        if (result) {
            if (result.name == name) {
                res.render('admin/success', {
                    userInfo: req.cookiesInfo,
                    mes: '修改结果一样',
                    url: '/admin/category'
                })
            } else {
                Category.findOne({ _id: { $ne: id }, name }).then(result => {
                    if (result) {
                        res.render('admin/error', {
                            userInfo: req.cookiesInfo,
                            mes: '改名字已被注册',
                        })
                    } else {
                        Category.update({ _id: id }, { name }).then(result => {
                            res.render('admin/success', {
                                userInfo: req.cookiesInfo,
                                mes: '修改成功',
                                url: '/admin/category'
                            })
                        })
                    }
                })
            }
        }


    })
})
// 删除分类
router.get('/category/delete', (req, res) => {
    let { id } = req.query
    Category.remove({ _id: id }).then(result => {
        if (result) {
            res.render('admin/success', {
                userInfo: req.cookiesInfo,
                mes: '删除成功',
                url: '/admin/category'
            })
        }
    })
})


// 文章首页
router.get('/content', (req, res) => {
    // 页数
    var page = Number(req.query.page || 1)
    // 几页一分
    var limit = 2
    // 忽略的个数
    var skip = (page - 1) * limit
    // 总页数
    var pages = 0
    Content.count().then((num) => {
        // 计算总页数
        pages = Math.ceil(num / limit)

        // 取值不能小于1
        page = Math.max(page, 1)
        // 取值不超过pages(总页数)
        if (page > pages) {
            page = pages
        }
        // sort:1升序，-1降序
        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['user', 'category']).then((contents) => {
            res.render('admin/content_index', {
                userInfo: req.cookiesInfo,
                contents: contents,
                count: num,
                limit,
                pages,
                page,
                title: 'content'

            })
        })
    })
})
// 添加文章
router.get('/content/add', (req, res) => {
    Category.find().sort({ _id: -1 }).then(result => {
        res.render('admin/content_add', {
            userInfo: req.cookiesInfo,
            result
        })
    })

})
router.post('/content/add', (req, res) => {
    let { category, title, description, content } = req.body
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.cookiesInfo,
            mes: '标题不能为空',
        })
    } else {
        new Content({
            category,
            title,
            user: req.cookiesInfo.id,
            description,
            content

        }).save().then(result => {
            res.render('admin/success', {
                userInfo: req.cookiesInfo,
                mes: '文章发布成功',
                url: '/admin/content'
            })
        })
    }
})
// 修改文章
router.get('/content/edit', (req, res) => {
    let { id } = req.query
    var result = []
    Category.find().sort({ _id: -1 }).then(category => {
        result = category
    })
    Content.findOne({ _id: id }).populate('category').then(content => {
        res.render('admin/content_edit', {
            userInfo: req.cookiesInfo,
            result,
            content
        })
    })

})
router.post('/content/edit', (req, res) => {
    let { id } = req.query
    let { category, title, description, content } = req.body
    if (title == '') {
        res.render('admin/error', {
            userInfo: req.cookiesInfo,
            mes: '标题内容为空',
        })
        return
    }
    Content.update({ _id: id }, { category, title, description, content }).then(result => {
        res.render('admin/success', {
            userInfo: req.cookiesInfo,
            mes: '修改成功',
            url: '/admin/content'
        })
    })

})
// 删除文章
router.get('/content/delete', (req, res) => {
    let { id } = req.query
    Content.remove({ _id: id }).then(result => {
        if (result) {
            res.render('admin/success', {
                userInfo: req.cookiesInfo,
                mes: '删除成功',
                url: '/admin/content'
            })
        }
    })
})
module.exports = router