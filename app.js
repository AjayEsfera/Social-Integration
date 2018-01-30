var express =  require('express');
var routes = require('./routes/main');
var profile = require('./routes/dashboard');
var path = require('path');
var http = require('http');
var session = require('express-session');
var bodyparser = require('body-parser');

var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 100000 }
}))
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

 //Body Parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',routes.index);
app.post('/process',routes.process);
app.get('/logout',routes.logout);
app.get('/dashboard',profile.dashboard);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on Jadeport ' + app.get('port'));
});