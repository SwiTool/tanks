'use strict';

var _GameServer = require('./Game/GameServer');

var _GameServer2 = _interopRequireDefault(_GameServer);

var _Ball = require('./Game/Balls/Ball');

var _Ball2 = _interopRequireDefault(_Ball);

var _Tank = require('./Game/Tanks/Tank');

var _Tank2 = _interopRequireDefault(_Tank);

var _availableTanks = require('./Game/Tanks/availableTanks');

var _availableTanks2 = _interopRequireDefault(_availableTanks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var app = express();

//Static resources server
app.use(express.static(__dirname + '/../www'));

var server = app.listen(process.env.PORT || 8082, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = require('socket.io')(server);

var game = new _GameServer2.default();

/* Connection events */

io.on('connection', function (client) {
	client.on('availableTanksRequest', function () {
		client.emit('availableTanksResponse', _availableTanks2.default);
	});

	client.on('gameJoinRequest', function (tank) {
		console.log(tank.id + ' joined the game');
		var tank = null;
		switch (parseInt(tank.type)) {
			case 1:
				tank = new MiniTank(tank.id);
				break;
			case 2:
				tank = new NormalTank(tank.id);
				break;
			case 3:
				tank = new HeavyTank(tank.id);
				break;
			default:
				return;
		}
		if (game.addTank(tank)) {
			var data = tank.toJson();
			client.broadcast.emit('addTank', data);
			client.emit('gameJoinAccept', data);
		} else {
			client.emit('gameJoinDeny', { message: "Tank name already taken." });
		}
	});

	/*client.on('sync', function(data){
 	//Receive data from clients
 	if(data.tank != undefined){
 		game.syncTank(data.tank);
 	}
 	//update ball positions
 	game.syncBalls();
 	//Broadcast data to clients
 	client.emit('sync', game.getData());
 	client.broadcast.emit('sync', game.getData());
 
 	//I do the cleanup after sending data, so the clients know
 	//when the tank dies and when the balls explode
 	game.cleanDeadTanks();
 	game.cleanDeadBalls();
 	counter ++;
 });
 
 client.on('shoot', function(ball){
 	var ball = new Ball(ball.ownerId, ball.alpha, ball.x, ball.y );
 	ball.id = game.lastBallId;
 	game.increaseLastBallId();
 	game.addBall(ball);
 });
 
 client.on('leaveGame', function(tankId){
 	console.log(tankId + ' has left the game');
 	game.removeTank(tankId);
 	client.broadcast.emit('removeTank', tankId);
 });*/
});
