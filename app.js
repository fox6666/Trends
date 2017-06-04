/**
 * Created by Owen on 2017/6/1.
 */
var express = require("express");
var app = express();
var session = require("express-session");
var router = require("./router/index");

app
    .all('*',function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');//允许的域名（ * 所有域）
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');  //服务器支持的头信息
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//允许的方法
        if (req.method == 'OPTIONS') {
          res.send(200); /*让options请求快速返回*/
        }
        else {
          next();
        }
    })

    .use(express.static("./public"))

    .use(session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    }))

    .get("/",function(req,res){
        router.showIndex(req,res);
    })

    // 注册
    .post("/register",function(req,res){
        router.register(req,res);
    })

    // 登入
    .post("/login",function(req,res){
      router.login(req,res);
    })

    // 修改资料
    .post("/revise-data",router.reviseData)

    // 发表说说
    .get("/publish",router.publish)

    // 获取全部说说
    .get("/all-trends",router.allTrends)

    // 获取我的说说
    .get("/my-trends",router.myTrends)

    // 点赞功能
    .put("/assist",router.assist)

    // 获取头像
    .get("/head-picture",router.headPicture)
    
    //获取好友列表
    .get("/my-firends",router.myFirends)
    
    //获取特定的用户  添加好友功能
    .get("/add-firends",router.addFirends)
    .listen(3000);
