const express = require('express')
//路由对象
const router = express.Router()
const User = require('../models/User')
const Content = require('../models/Content')

var returnData;
router.use(function (req, res, next) {
    returnData = {}
    next()
})

// 注册
router.post('/user/register', (req, res) => {
    let { username, password, repassword } = req.body
    if (username == '') {
        returnData.code = '201'
        returnData.mes = '用户名为空'
        res.json(returnData)
        return
    }
    if (password == '') {
        returnData.code = '202'
        returnData.mes = '密码为空'
        res.json(returnData)
        return
    }
    if (repassword == '') {
        returnData.code = '203'
        returnData.mes = '确认为空'
        res.json(returnData)
        return
    }
    if (repassword != password) {
        returnData.code = '204'
        returnData.mes = '两次密码不一致'
        res.json(returnData)
        return
    }
    User.findOne({ username: username }).then(function (result) {
        if (result) {
            // 表示已经有了
            returnData.code = '205'
            returnData.mes = '用户名已被注册'
            res.json(returnData)
            return
        }
        var user = new User({
            username,
            password
        })
        user.save().then(function (result) {
            returnData.code = '200'
            returnData.mes = '注册成功'
            res.json(returnData)
            console.log(result)
        })

    })

})

//登录
router.post('/user/login', (req, res) => {
    let { username, password } = req.body
    if (username == '' || password == '') {
        returnData.code = '201'
        returnData.mes = '用户名密码不能为空'
        res.json(returnData)
        return
    }
    User.findOne({
        username: username,
        password: password
    }).then(function (result) {
        if (result) {
            returnData.code = '200'
            returnData.info = {
                id: result.id,
                username: result.username
            }
            returnData.mes = '登录成功'
            req.cooikes.set('cooikeInfo', JSON.stringify({
                id: result.id,
                username: result.username
            }))
            res.json(returnData)
        } else {
            returnData.code = '205'
            returnData.mes = '用户名密码错误'
            res.json(returnData)
        }
    })
})
// 退出登录
router.get('/user/logout', (req, res) => {
    req.cooikes.set('cooikeInfo', null)
    returnData.code = '200'
    returnData.mes = '退出登录'
    res.json(returnData)
})
// 评论
router.get('/comment/get', (req, res) => {
    let { content_id } = req.query
    Content.findOne({ _id: content_id }).then(result => {
        returnData.code == '200',
            returnData.data = result,
            returnData.mes = '返回成功',
            res.json(returnData)
    })
})
router.post('/comment', (req, res) => {
    let { content_id, content } = req.body
    Content.findOne({ _id: content_id }).then(result => {
        result.comment.push({ username: req.cookiesInfo.username, content, addTime: new Date() })
        result.save().then(resul => {
            returnData.code == '200'
            returnData.data = resul,
                returnData.mes = '评论成功'
            res.json(returnData)
        })
    })
})

module.exports = router