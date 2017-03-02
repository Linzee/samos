var fs = require("fs");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname + '/../build/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../build')));

//because nginx is used.. DISABLE if it is not!
// app.set('trust proxy', true);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.send({
		'error': err.message
	});
});

module.exports = app;