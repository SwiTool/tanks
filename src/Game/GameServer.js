const random = require('random-js')();

class GameServer {
	constructor(width, height) {
		this.tanks = {};
		this.balls = [];
		this.terrain = {
			x: width,
			y: height
		};
	}

	addTank(tank) {
		var offsetX = tank.getSpriteOffsetX();
		var offsetY = tank.getSpriteOffsetY();
		tank.x = random.integer(offsetX, this.terrain.x - offsetX);
		tank.y = random.integer(offsetY, this.terrain.y - offsetY);
		if (this.tanks[tank.id]) {
			return false;
		}
		this.tanks[tank.id] = tank;
		return true;
	}

	//The app has absolute control of the balls and their movement
	syncBalls() {
		var self = this;
		//Detect when ball is out of bounds
		this.balls.forEach( function(ball){
			self.detectCollision(ball);

			if(ball.x < 0 || ball.x > this.terrain.x
				|| ball.y < 0 || ball.y > this.terrain.y){
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