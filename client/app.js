var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var recipesRouter = require("./routes/recipe");
var accountRouter = require("./routes/account");
var aboutRouter = require("./routes/about");
var contactRouter = require("./routes/contact");
var adminRouter = require("./routes/admin");
var publicUserRouter =require("./routes/public_user_profile");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const BASE_DIR_PATH = "public";
console.log(`Client is being served from: [${BASE_DIR_PATH}]`);
app.use(express.static(path.join(__dirname, BASE_DIR_PATH)));

app.use('/', indexRouter);
app.use("/recipes", recipesRouter);
app.use("/account", accountRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use("/admin", adminRouter);
app.use("/public_user_profile",publicUserRouter);

// catch 404 and forward to error handler
app.use(function (_, _, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;