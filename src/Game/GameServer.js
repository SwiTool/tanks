const random = require('random-js')();

class GameServer {
	constructor(width, height) {
		this.tanks = {};
		this.balls = [];
		this.terrain = {
			w: width,
			h: height
		};
	}

	addTank(tank, id) {
		var offsetX = tank.getSpriteOffsetX();
		var offsetY = tank.getSpriteOffsetY();
		tank.x = random.integer(offsetX, this.terrain.w - offsetX);
		tank.y = random.integer(offsetY, this.terrain.h - offsetY);
		if (this.tanks[id]) {
			return false;
		}
		this.tanks[id] = tank;
		return true;
	}

	removeTank(id) {
		if (this.tanks[id]) {
			delete this.tanks[id];
			return true;
		}
		return false;
	}

	//The app has absolute control of the balls and their movement
	syncBalls() {
		var self = this;
		//Detect when ball is out of bounds
		this.balls.forEach( function(ball){
			self.detectCollision(ball);

			if(ball.x < 0 || ball.x > this.terrain.w
				|| ball.y < 0 || ball.y > this.terrain.h){
				ball.out = true;
			}else{
				ball.fly();
			}
		});
	}

	//Detect if ball collides with any tank
	detectCollision(ball){
		for (var i in this.tanks) {
			var tank = this.tanks[i];
			if (tank.id != ball.ownerId &&
				Math.abs(tank.x - ball.x) < 30 &&
				Math.abs(tank.y - ball.y) < 30) {
				//Hit tank
				this.hurtTank(tank);
				ball.out = true;
				ball.exploding = true;
			}
		}
	}

}

export default GameServer;