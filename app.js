var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socketIO = require('socket.io')(); //({ path: '/socket.io' });
const Twitter = require('twitter');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serving the react index file as root file.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// app.use('/', index);
app.use('/users', users);

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

// socket.io settings
app.socketIO = socketIO;

const chat = socketIO.on('connection', function(socket){
  console.log('Socket connected');
  socket.on('my other event', function(data){
    console.log(data);
  });
});

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let stream = null;

if(process.env.STREAM_STATUS == 'true') {
  console.log("Streaming enabled");
  stream = client.stream('statuses/filter', {track: 'javascript'});

  stream.on('data', function(event) {
    chat.emit('news', { 
      'id' : event.id,
      'user': event.user.screen_name, 
      'image': event.user.profile_image_url,
      'text': event.text }
    );
  });
  
  stream.on('error', function(error) {
    console.log(error);
    throw error;
  });
} else { console.log("Streaming disabled"); }

module.exports = app;
