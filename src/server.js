'use strict';

var _consts = require('./consts');

var _consts2 = _interopRequireDefault(_consts);

var _GameServer = require('./Game/GameServer');

var _GameServer2 = _interopRequireDefault(_GameServer);

var _Bullet = require('./Game/Bullets/Bullet');

var _Bullet2 = _interopRequireDefault(_Bullet);

var _MiniTank = require('./Game/Tanks/MiniTank');

var _MiniTank2 = _interopRequireDefault(_MiniTank);

var _NormalTank = require('./Game/Tanks/NormalTank');

var _NormalTank2 = _interopRequireDefault(_NormalTank);

var _HeavyTank = require('./Game/Tanks/HeavyTank');

var _HeavyTank2 = _interopRequireDefault(_HeavyTank);

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

var game = new _GameServer2.default(1000, 600);

/* Connection events */

io.on('connection', function (client) {
	client.on('availableTanksRequest', function () {
		client.emit('availableTanksResponse', _availableTanks2.default);
	});

	client.on('gameJoinRequest', function (tankData) {
		console.log(tankData.id + ' joined the game');
		var tank = null;
		switch (parseInt(tankData.type)) {
			case 1:
				tank = new _NormalTank2.default(tankData.id);
				break;
			case 2:
				tank = new _MiniTank2.default(tankData.id);
				break;
			case 3:
				tank = new _HeavyTank2.default(tankData.id);
				break;
			default:
				return;
		}
		if (game.addTank(tank)) {
			var data = tank.toJson();
			client.broadcast.emit('addTank', data);
			client.emit('gameJoinAccept', data);
			client.emit('gameTerrainLimit', game.terrain);
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
