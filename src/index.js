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
		if (game.addTank(tank)) {
			var data = tank.toJson();
			client.broadcast.emit('addTank', data);
			client.emit('gameJoinAccept', data);
			client.emit('gameTerrainLimit', game.terrain);
		} else {
			client.emit('gameJoinDeny', {message: "Tank name already taken."});
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