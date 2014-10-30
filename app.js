var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes');

var app = express();

var memorystore = new session.MemoryStore();

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var iosessions = require('socket-io.sessions');

var people = {};

io.set('authorization', iosessions({
    key: 'connect.sid',
    secret: 'secret',
    store: memorystore
}));

io.sockets.on('connection', function(socket) {
    // get session id and add user to chat.
    socket.handshake.getSession(function (err, session) {
        if(err) {
            console.log(err);
        }
        if(session != undefined) {
            people[socket.id] = {'fname': session.user.fname, 
                                'lname': session.user.lname, 
                                'username': session.user.username};
            socket.broadcast.emit('connected', 
                {'fname': session.user.fname, 
                'lname': session.user.lname});
        } else {
            socket.emit('error', 'not logged in.');
        }
    });

    // send message by user.
    socket.on('send', function(message) {
        if(people[socket.id] != undefined) {
            socket.emit('my-message',
                {'fname': people[socket.id].fname,
                 'message': message});
            socket.broadcast.emit('message', 
                {'fname': people[socket.id].fname,
                 'message': message});
        } else {
            socket.emit('error', 'not logged in.');
        }
    });

    // remove user from chat.
    socket.on('disconnect', function() {
        if(people[socket.id] != undefined) {
            socket.broadcast.emit('disconnected', 
                {'fname': people[socket.id].fname,
                'lname': people[socket.id].lname});
            delete people[socket.id];
            console.log("disconnected");
        }    
    });
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'secret', store: memorystore}));
app.use(express.static(path.join(__dirname, 'public')));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.get('/', routes.index);
app.post('/login', routes.login);
app.get('/chat', routes.chat);

server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
