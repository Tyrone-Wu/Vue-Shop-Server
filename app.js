const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(
  session({
    secret: '123456',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 设置session的有效时间
  })
);

// 设置跨域
// app.all('*', function (req, res, next) {
//   if (!req.get("Origin")) return next();
//   res.set("Access-Control-Allow-Origin", "*");
//   res.set("Access-Control-Allow-Method", "GET");
//   res.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//   next();
// })

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(3000);
console.log('***********************************');

console.log('localhost started at: 3000...');
// module.exports = app;