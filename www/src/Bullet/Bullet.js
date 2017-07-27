import BulletRenderer from './BulletRenderer';
import EventEmitter from 'events';

class Bullet extends EventEmitter {
	constructor(app, x, y, angle, options) {
		super();
		this.app = app;
		this.options = options;

		this.renderer = new BulletRenderer(this.app, options.bullet, options.bulletInfo);
		this.renderer.setPosition(x, y);

		//angle of shot in radians
		this.angle = angle;

		this.out = false;

		this.app.ticker.add((delta) => {
			var limits = window.tankGame.limits;
			var speedX = this.options.bulletInfo.speed * Math.sin(this.angle) * delta;
			var speedY = -this.options.bulletInfo.speed * Math.cos(this.angle) * delta;
			if (this.renderer) {
				this.renderer.bullet.position.x += speedX;
				this.renderer.bullet.position.y += speedY;
				if (this.renderer.bullet.position.x < 0 || this.renderer.bullet.position.x > limits.w - 15
					|| this.renderer.bullet.position.y < 0 || this.renderer.bullet.position.y > limits.h - 15) {
					this.emit('bulletOut');
				}
			}
		});
	}

}

export default Bullet;