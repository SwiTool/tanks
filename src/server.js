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
				tank = new _NormalTank2.default(game, tankData.id);
				break;
			case 2:
				tank = new _MiniTank2.default(game, tankData.id);
				break;
			case 3:
				tank = new _HeavyTank2.default(game, tankData.id);
				break;
			default:
				return;
		}
		var tanks = JSON.parse(JSON.stringify(game.tanks));
		if (game.addTank(tank, client.id)) {
			var data = tank.toJson();
			var toSend = {
				clientId: client.id,
				tankData: data
			};
			client.broadcast.emit('addTank', toSend);
			client.emit('gameJoinAccept', toSend);
			client.emit('gameTerrainLimit', game.terrain);
			client.emit('gameListTanks', tanks);
		} else {
			client.emit('gameJoinDeny', { message: "Can't join game" });
		}
	});

	client.on('shoot', function (data) {
		var tank = game.tanks[client.id];
		if (!tank) {
			return;
		}
		tank.updatePosition();
		if (!tank.shootRate.canShoot()) {
			return;
		}
		var shootData = tank.shoot(data.angle);
		io.sockets.emit('shoot', {
			clientId: client.id,
			shootData: shootData
		});
	});

	client.on('velocityChange', function (data) {
		var tank = game.tanks[client.id];
		if (!tank) {
			return;
		}
		data.vx = data.vx > 1 ? 1 : data.vx < -1 ? -1 : data.vx;
		data.vy = data.vy > 1 ? 1 : data.vy < -1 ? -1 : data.vy;
		client.broadcast.emit('velocityChange', {
			clientId: client.id,
			velocity: data
		});
		tank.updatePosition(data);
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
 */

	client.on('gameLeaveRequest', function () {
		if (game.tanks[client.id]) {
			console.log(game.tanks[client.id].id + ' has left the game');
		}
		game.removeTank(client.id);
		client.broadcast.emit('removeTank', client.id);
	});
});
