'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var zxcvbn = require('zxcvbn');

var app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(bodyParser.text({ type: 'text/password' }));

app.post('/zxcvbn', function(req, res) {
	if(req.is('text/password') && req.body) {
		var result = zxcvbn(req.body);
		delete result['password'];
		delete result['sequence'];
		res.json(result);
	} else {
		res.sendStatus(400);
	}
});

var server = app.listen(process.env.PORT || 8410);
