'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var multer = require('multer');
var upload = multer({dest: './tmp/'});


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
var uploadCtrl = require('controllers/upload');
app.post('/upload', upload.any(), function (req, res) {
	uploadCtrl.upload(req.files, req.query, req.body)
		.then(function (data) {
			res.json(data);
		})
		.catch(function (err){
			res.status(500, {
				error: err
			});
		});
});
app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// Start the app
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});