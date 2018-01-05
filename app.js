const express = require('express');
var bodyParser = require('body-parser')
var http = require('http');
var path = require('path');
var index = require('./routes/index')
var ejs = require('ejs');
var $ = require('jquery');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(index);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server is up and running at port ' + app.get('port'));
});
