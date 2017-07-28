import io from 'socket.io-client';

import Home from './Home/Home';
import Game from './Game/Game';

var PIXI = require('pixi.js');

window.tankGame = {};

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

window.tankGame.socket = io('http://localhost:8082');
const socket = window.tankGame.socket;

var app = new PIXI.Application({width: w, height: h, autoResize: true, backgroundColor : 0xadd8e6});
window.app = app;
document.body.appendChild(app.view);

new Home(app);

socket.on('gameJoinAccept', (data) => {
	if (window.tankGame.game) {
		delete window.tankGame.game;
	}
	window.tankGame.game = new Game(data);
});


window.tankGame.limits = {
	x: 0,
	y: 0,
	w: w,
	h: h
};
window.tankGame.gameContainer = new PIXI.Container();
app.stage.addChild(window.tankGame.gameContainer);

var limits = new PIXI.Graphics();
limits.lineStyle(2, 0x0000FF, 1);
limits.drawRect(0, 0, w, h);
app.stage.addChild(limits);
socket.on('gameTerrainLimit', (data) => {
	limits.clear();
	limits.lineStyle(2, 0x0000FF, 1);
	limits.drawRect((w-data.w)/2, (h-data.h)/2, data.w, data.h);
	window.tankGame.limits = {
		x: (w-data.w)/2,
		y: (h-data.h)/2,
		w: data.w,
		h: data.h
	};
	window.tankGame.gameContainer.position.x = (w-data.w)/2;
	window.tankGame.gameContainer.position.y = (h-data.h)/2;
});

window.onbeforeunload = () => {
	if (window.tankGame.game) {
		socket.emit('gameLeaveRequest');
	}
};