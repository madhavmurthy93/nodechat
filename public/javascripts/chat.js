$(document).ready(function() {
	'use strict';
	var socket = io.connect('http://localhost:3000');

	$('form').submit(function(e) {
		e.preventDefault();
	});

	$('#myModal').modal('hide');	

	socket.on('connected', function(user) {
		var msg = user.fname + " " + user.lname + " has joined the chat";
		$('.modal-body > p').text(msg);
		$('#myModal').modal('show');
	});
    
    socket.on('update', function(update) {
        var username = update.username;
        var messages = update.messages;
        for (var i = 0; i < messages.length; i++) {
            var msg = messages[i];
            var text;
            if (msg.sender.username == update.username) {
                text = "<div class='right'><h2><i class='fa fa-user'></i>" + msg.sender.fname + "</h2><p class='bg-info'>" + msg.message + "</p><p class='date'>" + msg.date + "</p></div>";
            } else {
                text = "<div class='left'><h2><i class='fa fa-user'></i>" + msg.sender.fname + "</h2><p class='bg-success'>" + msg.message + "</p><p class='date'>" + msg.date + "</p></div>";
            }
            $('#messages').append(text);
            $('#messages').scrollTop($('#messages').prop('scrollHeight'));
        }
    });      

	socket.on('disconnected', function(user) {
		var msg = user.fname + " " + user.lname + " has left the chat";
		$('.modal-body > p').text(msg);
		$('#myModal').modal('show');
	});

	socket.on('my-message', function(msg) {
		var message;
		message = "<div class='right'><h2><i class='fa fa-user'></i>" + msg.fname + "</h2><p class='bg-info'>" + msg.message + "</p><p class='date'>" + msg.date + "</p></div>";
		$('#messages').append(message);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('message', function(msg) {
		var message;
		message = "<div class='left'><h2><i class='fa fa-user'></i>" + msg.fname + "</h2><p class='bg-success'>" + msg.message + "</p><p class='date'>" + msg.date + "</p></div>";
		$('#messages').append(message);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('error', function(error) {
		var message = "You are " + error + "Please go to the home page - <a href='/'>Login</a>.";
		$('.modal-body > p').text(msg);
		$('#myModal').modal('show'); 
	});

	$('#send').click(function() {
		var msg = $('#message').val();
		if(msg.match(/\S/) != null) {
			socket.emit('send', msg);
			$('#message').val('');
		}
	});
});
