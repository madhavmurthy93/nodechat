var express = require('express');

// get home page.
exports.index = function (req, res) {
	if(!req.session.user) {
		res.render('index');
	} else {
		res.redirect('/chat');
	}	
};

// start session for user on login.
exports.login = function (req, res) {
	if(req.session.user) {
		res.redirect('/chat');
	} else {
		req.session.user = {'fname': req.param('fname'), 
							'lname': req.param('lname'), 
							'username': req.param('username')};
		res.redirect('/chat');
	}
}

// get chat page.
exports.chat = function (req, res) {
	if(!req.session.user) {
		res.redirect('/');
	} else {
		res.render('chat');
	}
};