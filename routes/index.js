var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var Post = require("../models/post.js");
var crypto = require('crypto');//用于md5加密
var path = require('path');
/* GET home page. */
//首页
router.get('/', function(req, res) {
    Post.get(null,function(err,posts){
        if(err){
            posts=[];
        }
        console.log("<<<<<<<<<<<<<<<<<<<<KKKKKKKKK"+JSON.stringify(posts));
        res.render("index",{
            title:"首页",
            posts: posts,
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString()

        })
    })
});

router.get('/u/:username', function(req, res) {
    //...用户主页
    User.get(req.params.username,function(err,user){
        if(!user){
            req.flash("error","用户不存在");
            return res.redirect("/");
        }
        Post.get(user.username,function(err,posts){
            if(err){
                req.flash("error",err);
                return res.redirect("/");
            }

            res.render("user",{
                title:user.username,
                posts:posts
            })
        })
    })
});

router.post('/post',checkLogin);
router.post('/post', function(req, res) {
    //发表信息
    var user = req.session.user;
    var post=new Post(user.username,req.body.post);
    console.log("post"+req.body.post);
    post.save(function(err){
        console.log("gggggggggggggggggg"+user.username);
        if(err){
            console.log("发表失败"+err);
            req.flash("error",JSON.stringify(err));
            return res.redirect("/");
        }
        req.flash("success","发表成功");
        console.log("发表成功");
        res.redirect("/u/"+user.username);
    })
});

router.get("/reg",checkNotLogin);
router.get('/reg', function(req, res) {
    //用户注册--弹出用户注册表单
    res.render("reg",{title:"用户注册"});
});

router.post('/reg', function(req, res) {
    //用户注册--用户提交注册，提交表单

    //两次输入的密码是否一致
    if(req.body['pass1']!=req.body['pass2']){
         req.flash("error","两次输入的密码不一致");
        return res.redirect("/reg");
    }

    //生成密码的散列zhi
    var md5=crypto.createHash("md5");
    var password = md5.update(req.body["pass1"]).digest("base64");

    var newUser = new User({
        username:req.body["username"],
        password:password
    })

    User.get(newUser.username,function(err,user){
        console.log("<<<<<"+newUser.username);
        if(user){
            err="用户名已经存在";
        }

        if(err){
            console.log("err"+err);
            req.flash("error",err);
            return res.redirect("/reg");
        }
        newUser.save(function(err){
            if(err){
                req.flash("error",err);
                return res.redirect("/reg");
            }
            req.session.user=newUser;
            req.flash("success","注册成功");
            return res.redirect("/");
        })
    })
});

router.get("/login",checkNotLogin);
router.get('/login', function(req, res) {
    //用户登录
    res.render("login",{title:"用户登录"});
});
router.post('/login', function(req, res) {
    //用户登录
    //生成密码的散列zhi
    var md5=crypto.createHash("md5");
    var password = md5.update(req.body["password"]).digest("base64");
    var username = req.body.username;
    User.get(username,function(err,user){
        if(!user){
            req.flash("error","用户名不存在");
            return res.redirect("/login");
        }
        if(user.password!=password){
            req.flash("error","密码错误");
            return res.redirect("/login");
        }

        req.session.user=user;
        req.flash("success","登录成功");
        res.redirect("/");
    })
});
router.get("/logout",checkLogin);
router.get('/logout', function(req, res) {
    //用户登出
    req.session.user=null;
    req.flash("success","成功退出");
    res.redirect("/");
});

//登出功能只对于已经登录的用户开放,所以要检查登录
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash("error","未登录");
        return res.redirect("/login");
    }
    next();
}
//注册和登录功能是为了没有登录的用户，所以要检查没有登录
function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash("error","已登录");
        return res.redirect("/");
    }
    next();
}

module.exports = router;
