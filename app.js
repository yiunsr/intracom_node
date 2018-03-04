const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

var fs = require('fs');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');

const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const moment_timezone = require('moment-timezone');

const index = require('./routes/index');
const users = require('./routes/users');
const admin = require('./routes/admin');
const attendances = require('./routes/attendances');
const db = require('./db.js')();
var config = require('./config/config');


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.set('layout', 'base.ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//// 파일로그 설정
if(app.get('env') === 'production'){
  var logDirectory = config.logpath;

  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  // create a rotating write stream
  var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily,
    size:     '10M', 
    path: logDirectory,
    compress: 'gzip' 
  })

  // setup the logger
  app.use(morgan('combined', {stream: accessLogStream}))
}
else{
  //var logDirectory = path.join(__dirname, 'log');
  app.use(morgan('dev'));
}




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: '@Inter__Com'}));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
const User = require('./models/users');
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// global 값 설정
// path 설정 및 User 정보 설정
app.use(function(req, res, next){
  const pathList = req.path.split('/');
  if(pathList.length >= 2){
    res.locals.path1 = pathList[1];
  }
  else{
    res.locals.path1 = "";
  }

  if(pathList.length >= 3){
    res.locals.path2 = pathList[2];
  }
  else{
    res.locals.path2 = "";
  }

  if(req.user){
    res.locals.useremail = req.user.email;
    res.locals.usertype = req.user.usertype;
  }
  else{
    res.locals.useremail = "";
    res.locals.usertype = "guest"
  }
    
  next();
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/attendances', attendances);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});


// EJS 에서 사용하는 변수 저장
app.locals = {
  title : "intraCom", 
  description : "intraCom",
  site : {
    jsver : "00000001",
    cssver : "00000001",
    description : "description"
  },
  getLocaltime : function(utctime){
    var seoul = moment_timezone(utctime).tz('Asia/Seoul');
    return seoul.format().slice(0,19).replace(/T/g," "); 
  }
};

// https://stackoverflow.com/questions/38983895/how-do-i-create-a-superadmin-account-for-an-express-js-app
const init = require('./config/init');
init(app, db);

module.exports = app;
