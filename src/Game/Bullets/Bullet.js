class Bullet {
	constructor(x, y, alpha) {
		if (this.constructor === Bullet) {
        	throw new Error("Cannot instantiate this class");
    	}
		this.alpha = alpha;
		this.x = x;
		this.y = y;
		this.out = false;
		this.data = null;
	}

	fly() {
		//move to trayectory
		var speedX = this.data.speed * Math.sin(this.alpha);
		var speedY = -this.data.speed * Math.cos(this.alpha);
		this.x += speedX;
		this.y += speedY;
	}
}

export default Bullet;