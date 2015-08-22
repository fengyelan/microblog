/**
 * Created by yuanlan on 2015/8/22.
 */
var mongodb = require("./db.js");

function Post(username,post,time){
    this.username=username;
    this.post=post;
    if(time){
        this.time=time;
    }else{
        this.time=new Date();
    }
}
module.exports=Post;

Post.prototype.save=function save(callback){
    var post = {
        username:this.username,
        post:this.post,
        time:this.time
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection("posts",function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
          // collection.ensureIndex("username");
            collection.save(post,{safe:true},function(err,post){
                mongodb.close();
                callback(err,post);
            })
        })
    })
}

Post.get=function get(username,callback){
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(username){
                query.username=username;
            }
            collection.find(query).sort({time:-1}).limit(9).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err,null);
                }
                var posts=[];
                docs.forEach(function(doc,index){
                    var post = new Post(doc.username,doc.post,doc.time);
                    posts.push(post);
                });
                console.log("+++++++++++++++++++"+posts.length);
                callback(null,posts);
            })

        });
    })
}