var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

//ORマッパー(ObjectRerationMapper)---sequelizeなど
//ER図(エンティティー・リレーション図)を簡単に実現
const db = require('./models/index');

app.get('/',(req,res)=>{
  db.todo.findAll({}).then((results) => {
    res.render('index.ejs',{todos: results});
  });
});

app.post('/',(req,res)=>{
  const params = {
    content:req.body.todoContent
  };
  db.todo.create(params).then((results) => {
    res.redirect('/');
  });
});

app.delete('/:id',(req,res)=>{
  const filter = {
    where:{
      id: req.params.id
    }
  };
  db.todo.destroy(filter).then((results) => {
    res.redirect('/');
  });
});

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

module.exports = app;
