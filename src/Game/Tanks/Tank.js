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
		this.tankData 	= null;
		this.bulletData = null;
		this.type		= null;
	}

	getSpriteOffsetX() {
		return 30;
	}

	getSpriteOffsetY() {
		return 30;
	}

	toJson() {
		return {
			hp: this.tankData.hp,
			shield: this.tankData.shield,
			speed: this.tankData.speed,
			id: this.id,
			type: this.type,
			x: this.x,
			y: this.y
		}
	}
}

module.exports = Tank;