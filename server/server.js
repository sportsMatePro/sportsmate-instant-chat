const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message') ;
const {isRealString} = require('./utils/validation') ;
const {Users} = require('./utils/users') ;

const publicPath = path.join(__dirname, '../public');
const port = 80;

var app = express();
app.set('port', process.env.PORT || 80);



var server = http.createServer(app) ;
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath)) ;

io.on('connection', (socket) => {
	console.log('new user connected') ;
	

	socket.on('join', (params, callback) => {
		if ( !isRealString(params.order) || !isRealString(params.user) || !isRealString(params.type)) {
			return callback('name and room name not valid')
		} 

		socket.join(params.order);
		users.removeUser(socket.id);

		if(users.getUserListCount(params.order) >= 2)
		{
			console.log(users.getUserListCount(params.order));
			socket.disconnect();
		}
		else 
		{
			users.addUser(socket.id, params.user, params.order);

			io.to(params.order).emit('updateUsersList', users.getUserList(params.order));
			//here we greeting a new user
			socket.to(params.order).emit('Greeting', generateMessage('admin', 'welcome to our app'));

			// let other online user know that we have a new user
			socket.broadcast.to(params.order).emit('letOtherKnow', generateMessage(params.user, `${params.user} joined`));

			callback();

		
		/*socket.on('join', (params, callback) => {
			if ( !isRealString(params.order) || !isRealString(params.user) || !isRealString(params.type)) {
				callback('name and room name not valid')
			} 

			callback();*/
		}

		
	});

	socket.on('createMessage', (message) => {
		console.log('create message(1) on server', message) ;

		//io.emit('newMesage', generateMessage(message.from, message.text));
		var user = users.getUser(socket.id);
		console.log('create message(2) on server', user) ;

		if (user && isRealString(message.text)) {
				socket.broadcast.to(user.room).emit('newMesage', {
				from: user.name,
				text: message.text,
				createdAt: new Date().getTime() 
			});
		}
		

	});
	
	// on create a new call
	socket.on('createCall', (newCall) => {
		console.log('create Call on server', newCall) ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('newCall', {
			from: user.name,
			text: newCall.text,
			createdAt: new Date().getTime() 
		});
	});

	// on answer incoming call
	socket.on('answerCall', (answer) => {
		console.log('call accepted on server') ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('answer', {
			from: user.name,
			text: 'answerinig',
			createdAt: new Date().getTime() 
		});
	});

	// on reject incoming call
	socket.on('rejectCall', (reject) => {
		console.log('call rejected on server') ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('reject', {
			from: user.name,
			text: 'answerinig',
			createdAt: new Date().getTime() 
		});
	});

	// on cancel incoming call
	socket.on('cancelCall', (cancel) => {
		console.log('call canceled on server') ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('cancel', {
			from: user.name,
			text: 'canceled',
			createdAt: new Date().getTime() 
		});
	});

	// on ringing endded without response
	socket.on('noResponse', (missed) => {
		console.log('create Call on server', missed) ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('missed', {
			from: user.name,
			text: missed.text,
			createdAt: new Date().getTime() 
		});
	});

	// on ringing endded without response
	socket.on('sendFile', (reciveFile) => {
		console.log('create Call on server', reciveFile) ;
		var user = users.getUser(socket.id);
		socket.broadcast.to(user.room).emit('reciveFile', {
			fileName: reciveFile.fileName,
			fileType: reciveFile.fileType,
			createdAt: new Date().getTime() 
		});
	});

	socket.on('disconnect', () => {

		//console.log('user was diconnected') ;
		var outUser = users.getUser(socket.id);

		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
			io.to(user.room).emit('newMesage', generateMessage('admin', `${user.name} has left the chat !!`));
 		}
 		
		
	});
});

server.listen(80, () => {
	console.log(`server is up on port ${port}`) ;
});


