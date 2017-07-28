var express = require('express');
var app = express();

import consts from './consts';

import GameServer from './Game/GameServer';
import Bullet from './Game/Bullets/Bullet';

import MiniTank from './Game/Tanks/MiniTank';
import NormalTank from './Game/Tanks/NormalTank';
import HeavyTank from './Game/Tanks/HeavyTank';

import availableTanks from './Game/Tanks/availableTanks';
//Static resources server
app.use(express.static(__dirname + '/../www'));

var server = app.listen(process.env.PORT || 8082, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = require('socket.io')(server);

var game = new GameServer(1000, 600);

/* Connection events */

io.on('connection', function(client) {
	client.on('availableTanksRequest', () => {
		client.emit('availableTanksResponse', availableTanks);
	});

	client.on('gameJoinRequest', function(tankData){
		console.log(tankData.id + ' joined the game');
		var tank = null;
		switch (parseInt(tankData.type)) {
			case 1:
			tank = new NormalTank(tankData.id);
			break;
			case 2:
			tank = new MiniTank(tankData.id);
			break;
			case 3:
			tank = new HeavyTank(tankData.id);
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
			client.emit('gameJoinDeny', {message: "Can't join game"});
		}
	});

	client.on('shoot', (data) => {
		var tank = game.tanks[client.id];
		if (!tank) { return; }
		var shootData = tank.shoot(data.angle);
		io.sockets.emit('shoot', {
			clientId: client.id,
			shootData: shootData
		});
	});

	client.on('velocityChange', (data) => {
		data.vx = (data.vx > 1 ? 1 : (data.vx < -1 ? -1 : data.vx));
		data.vy = (data.vy > 1 ? 1 : (data.vy < -1 ? -1 : data.vy));
		client.broadcast.emit('velocityChange', {
			clientId: client.id,
			velocity: data
		});
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

	client.on('gameLeaveRequest', () => {
		if (game.tanks[client.id]) {
			console.log(game.tanks[client.id].id + ' has left the game');
		}
		game.removeTank(client.id);
		client.broadcast.emit('removeTank', client.id);
	});

});