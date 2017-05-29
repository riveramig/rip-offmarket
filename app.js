var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var config = require('./config');
var exphbs = require('express-handlebars');
var expressValidator= require('express-validator');
var flash= require('connect-flash');
var LocalStrategy = require('passport-local'),Strategy;
var mongo= require('mongodb');



var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express(),
   serv = app.listen(config.port),
   io = require('socket.io').listen(serv);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Connected to the database!!');
	}
});



 
console.log('listening on port: '+config.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({secret:config.secretKey}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Express Session
app.use(expressSession({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));


app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});




app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


//////// CHAT //////// 
io.sockets.on('connection',function(socket){
  socket.on('send message',function(data){
    socket.emit('new message',data);
   
  });
});



module.exports = app;
