import Tank from '../Tanks/Tank';

class Game {
	constructor(myData) {
		console.log("My Client ID: "+myData.clientId);
		window.removeTank = this.removeTank.bind(this);
		this.socket = window.tankGame.socket;

		var myTank = myData.tankData;
		var availableTanks = window.tankGame.availableTanks;
		var opt = availableTanks[myTank.type - 1];
		opt.id = myTank.id;
		opt.tankInfo.hp = myTank.hp;
		opt.tankInfo.speed = myTank.speed;
		opt.x = myTank.x;
		opt.y = myTank.y;

		this.tanks = {};
		this.myTank = new Tank(app, opt, true);

		this.tanks[myData.clientId] = this.myTank;
		this.initTankEvents();
	}

	initTankEvents() {
		this.myTank.on('velocityChange', (data) => {
			this.socket.emit('velocityChange', data);
		});
		this.myTank.on('shoot', (data) => {
			this.socket.emit('shoot', data);
		})

		this.socket.on('addTank', this.addTank.bind(this));
		this.socket.on('removeTank', this.removeTank.bind(this));
		this.socket.on('gameListTanks', this.onListTanks.bind(this));
		this.socket.on('shoot', this.onShoot.bind(this));
		this.socket.on('velocityChange', this.onVelocityChange.bind(this));
	}

	addTank(data) {
		var availableTanks = window.tankGame.availableTanks;
		var mergedTank = Object.assign(availableTanks[data.tankData.type - 1], data.tankData);
		this.tanks[data.clientId] = new Tank(app, mergedTank, false);
	}

	removeTank(data) {
		if (this.tanks[data]) {
			console.log("Tank " + data + " destroyed");
			this.tanks[data].destroy();
			delete this.tanks[data];
		}
	}

	onListTanks(tanks) {
		for (var i in tanks) {
			var tank = tanks[i];
			this.addTank({
				clientId: i,
				tankData: tank
			});
		}
	}

	onShoot(data) {
		var tank = this.tanks[data.clientId];
		tank.shoot(data.shootData.x, data.shootData.y, data.shootData.angle);
	}

	onVelocityChange(data) {
		//console.log(data);
		var tank = this.tanks[data.clientId];
		tank.setVelocity(data.velocity);
	}
}

export default Game;