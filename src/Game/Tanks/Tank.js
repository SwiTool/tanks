var random = require('random-js')();

class Tank {
	constructor(game, id) {
		if (this.constructor === Tank) {
        	throw new Error("Cannot instantiate this class");
    	}
		this.id			= id;
		this.game		= game;
		this.x			= 0;
		this.y			= 0;
		this.angle		= 0;
		this.tankInfo 	= null;
		this.bulletInfo = null;
		this.type		= null;
		this.moveData	= null;
		this.shootRate	= null;
	}

	getSpriteOffsetX() {
		return 30;
	}

	getSpriteOffsetY() {
		return 30;
	}

	getCannonLength() {
		return 60;
	}

	getCannonOffset() {
		return 10;
	}

	updatePosition(data) {
		var pos = null;
		if (data == undefined) {
			pos = this.moveData.getPosition();
		} else {
			if (this.moveData.isMoving()) {
				pos = this.moveData.getPosition();
			}
			this.moveData.move(data);
		}
		if (pos) {
			this.x += pos.x;
			this.y += pos.y;
			if (this.x > this.game.terrain.w - 30) {
				this.x = this.game.terrain.w - 30;
			} else if (this.x < 30) {
				this.x = 30;
			}
			if (this.y > this.game.terrain.h - 30) {
				this.y = this.game.terrain.h - 30;
			} else if (this.y < 30) {
				this.y = 30;
			}
		}
	}

	shoot(angle) {
		var cannonLength = this.getCannonLength();
		var cannonOffset = this.getCannonOffset();
		var deltaX = cannonLength * Math.sin(angle);
		var deltaY = cannonLength * -Math.cos(angle);
		var x = this.x + deltaX - cannonOffset;
		var y = this.y + deltaY - cannonOffset;
		return {
			x: x,
			y: y,
			angle: angle
		}
	}
	
	toJson() {
		return {
			hp: this.tankInfo.hp,
			shield: this.tankInfo.shield,
			speed: this.tankInfo.speed,
			id: this.id,
			type: this.type,
			x: this.x,
			y: this.y
		}
	}
}

module.exports = Tank;