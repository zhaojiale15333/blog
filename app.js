//导包
const express = require('express')
const swig = require('swig')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cooikes = require('cookies')
const User = require('./models/User.js')

// 配置模板引擎
// 1.定义模板引擎---访问html后缀文件时，引擎都会调用swig.renderFile方法解析文件
app.engine('html', swig.renderFile)
// 2.配置模板文件存放目录---第一个是固定参数，第二个是设置的当前的目录
app.set('views', './views')
// 3.注册所使用的模板引擎---第一个参数固定，第二个参数为app.engine中第一个参数
app.set('view engine', 'html')
// 开发时使用---默认会读取缓存的文件，这个是要每次去除缓存
swig.setDefaults({ cache: false })

// 设置中间件
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    req.cooikes = new cooikes(req, res)
    if (req.cooikes.get('cooikeInfo')) {
        try {
            req.cookiesInfo = JSON.parse(req.cooikes.get('cooikeInfo'))
            User.findById(req.cookiesInfo.id).then((result) => {
                req.cookiesInfo["isAdmin"] = Boolean(result.isAdmin)
                next()

            })

        } catch (e) { }
    } else {
        next()
    }


})
// 静态资源配置
app.use(express.static(__dirname + '/public'))
// 划分路由
app.use('/', require('./routers/main'))
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))

// 连接数据库and开启服务器
mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true

}, function (err) {
    console.log(err)
    if (err) {
        console.log('数据库链接失败')
    } else {
        console.log('数据库链接成功')
        app.listen(8080, () => {
            console.log('服务器开启了~~~,端口:4399')
        })
    }
})
