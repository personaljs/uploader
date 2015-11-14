'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var http = require('http');
var path = require('path');


var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/libs', express.static(path.join(__dirname, 'bower_components')));
//app.set('view engine', 'jade');
app.use(morgan('dev'));
// create application/json parser
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
// development only
if (env === 'development') {
	app.use(errorHandler());
}



// routes
app.post('/upload', function (req, res) {
	return require('controllers/upload').upload(req, res);
});
app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// Start the app
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});