var random = require('random-js')();

class Tank {
	constructor(id) {
		if (this.constructor === Tank) {
        	throw new Error("Cannot instantiate this class");
    	}
		this.id			= id;
		this.x			= 0;
		this.y			= 0;
		this.angle		= 0;
		this.tankInfo 	= null;
		this.bulletInfo = null;
		this.type		= null;
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