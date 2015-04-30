var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use("/ChatT", express.static('public'));

var connectedUsers = {};

io.on("connection", function(socket){
	console.log("User connected");

	socket.emit("current users", connectedUsers);

	socket.on("disconnect", function(){
		if(connectedUsers[socket.id] !== undefined) {
			console.log(connectedUsers[socket.id] + " disconnected");
			io.emit("disconnect message", connectedUsers[socket.id] + " disconnected.");
			io.emit("remove user", connectedUsers[socket.id]);
			delete connectedUsers[socket.id];
		}
	});

	socket.on("chat message", function(msg){
		socket.broadcast.emit("chat message", msg);
	});

	socket.on("new user", function(msg){
		socket.broadcast.emit("connect message", msg + " connected.");
		socket.broadcast.emit("new user", msg);
		connectedUsers[socket.id] = msg;
	});
});


http.listen(8080, "127.0.0.1", function(){
	console.log("Listening on *:80");
});
