'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var zxcvbn = require('zxcvbn');

var app = express();

app.disable('x-powered-by');
app.disable('etag');

app.use(bodyParser.text({ type: 'text/password' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var passwordStrength = function(password) {
	var result = zxcvbn(password.slice(0, 100));
	delete result['password'];
	delete result['sequence'];
	return result;
};

app.post('/zxcvbn', function(req, res) {
	if(req.is('text/password') && req.body) {
		res.json(passwordStrength(req.body));
	} else if(req.body && req.body.password) {
		res.json(passwordStrength(req.body.password));
	} else {
		res.sendStatus(400);
	}
});

var server = app.listen(process.env.PORT || 8410);
