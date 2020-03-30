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

//一覧表示
app.get('/',(req,res)=>{
  db.todo.findAll({}).then((results) => {
    res.render('index.ejs',{todos: results});
  });
});

//追加
app.post('/',(req,res)=>{
  const params = {
    content:req.body.todoContent
  };
  db.todo.create(params).then((results) => {
    res.redirect('/');
  });
});

//削除
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

//編集
app.get('/edit/:id',(req,res)=>{
  db.todo.findAll({
    where:{
      id:req.params.id
    }
  }).then((results)=>{
    res.render('edit.ejs',{todo: results[0]});
  });
  //urlに含まれたidを持つ要素を探索し、それをedit.ejsでレンダリングする
});

//更新
app.post('/update/:id',(req,res)=>{
  const update_value = {
    content:req.body.todoUpdate
  };
  const update_place = {
    where:{
      id:req.params.id
    }
  };
  db.todo.update(update_value,update_place).then((results)=>{
    res.redirect('/');
  });
  //idを探索する
  //一致するidの要素に対し、edit.ejsで入力された値にアップデートする
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
