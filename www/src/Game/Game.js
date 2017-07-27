import Tank from '../Tanks/Tank';

class Game {
	constructor(myTank) {
		var availableTanks = window.tankGame.availableTanks;
		var opt = availableTanks[myTank.type - 1];
		opt.id = myTank.id;
		opt.tankInfo.hp = myTank.hp;
		opt.tankInfo.speed = myTank.speed;
		opt.x = myTank.x;
		opt.y = myTank.y;

		this.myTank = new Tank(app, opt, true);
		this.socket = window.tankGame.socket;
		this.initTankEvents();
	}

	initTankEvents() {
		this.myTank.on('velocityChange', (data) => {
			this.socket.emit('velocityChange', data);
		});
		this.myTank.on('shoot', (data) => {
			this.socket.emit('shoot', data);
		})
	}
}

export default Game;