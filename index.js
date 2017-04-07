var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function(socket){
	
	socket.on('sendchat', function(message){
		io.sockets.emit('updatechat', socket.username, message);
	});

	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat','SERVER','You have connected');
		socket.broadcast.emit('updatechat','SERVER', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat','SERVER', socket.username + ' has disconnected');
	});

});

http.listen(8080, function(){
	console.log('listening on *: 8080');
});