var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.all("/:username",function(req,res,next){
    if(req.params.username=="123"){
        next();
    }else{
        next(new Error("username is error"));
    }

})
router.get("/:username",function(req,res){
   res.send(JSON.stringify(req.params.username));
})


module.exports = router;
