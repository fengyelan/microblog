var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var settings = require("./settings");

var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(session({
    secret:settings.cookieSecret,
    store:new MongoStore({
        db:settings.db

})
}))

app.use(function(req,res,next){
    var success=req.flash("success");
    var error=req.flash("error");

    success = success.length>0 ? success : null;
    error = error.length>0 ? error : null;

    res.locals.user = req.session.user;
    res.locals.success = success;
    res.locals.error = error;
    console.log("<<<<<<<<<<<<<"+JSON.stringify(res.locals.user));
    next();
})
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', routes);  //主页
app.use('/users', users);
//app.use('/hello', users);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
