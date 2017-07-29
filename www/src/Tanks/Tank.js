import TankRenderer from './TankRenderer';
import Keyboard from '../Keyboard';
import Bullet from '../Bullet/Bullet';
const EventEmitter = require('events');

class Tank extends EventEmitter {
	constructor(app, options, controllable) {
		super();
		this.app 	= app;
		this.maxHp 	= options.tankInfo.hp;
		this.hp 	= options.tankInfo.hp;
		this.shield = options.tankInfo.shield;
		this.speed 	= options.tankInfo.speed;
		this.id		= options.id;
		this.type	= options.type;
		this.x		= options.x;
		this.y		= options.y;
		this.bullet = options.bulletInfo;
		this.vx		= 0;
		this.vy		= 0;
		this.alpha	= 0;

		this.controllable = controllable;

		this.fireInterval = 0;
		this.lastfireTime = 0;
		this.options = options;

		this.bullets = [];

		this.renderer = new TankRenderer(this.app, options.base, options.cannon, this.toJson());

		this.app.ticker.add(this.tick, this);

		if (this.controllable) {
			this.initControls();
		}
	}

	destroy() {
		this.app.ticker.remove(this.tick, this);
		this.renderer.destroy();
		delete this.renderer;
	}

	tick(delta) {
		var limits = window.tankGame.limits;
		this.renderer.tank.position.x += (this.speed / 60 * this.vx) * delta;
		this.renderer.tank.position.y += (this.speed / 60 * this.vy) * delta;
		if (this.renderer.tank.position.x < 30) {
			this.renderer.tank.position.x = 30;
		} else if (this.renderer.tank.position.x > limits.w - 30) {
			this.renderer.tank.position.x = limits.w - 30;
		}
		if (this.renderer.tank.position.y < 30) {
			this.renderer.tank.position.y = 30;
		} else if (this.renderer.tank.position.y > limits.h - 30) {
			this.renderer.tank.position.y = limits.h - 30;
		}
		if (this.vx || this.vy) {
			this.renderer.base.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
			this.renderer.cannon.rotation = this.alpha - this.renderer.base.rotation;
		}
	}

	initControls() {
		this.renderer.cannon.on('mousemove', this.onMouseMove.bind(this));
		this.app.renderer.plugins.interaction.on('mousedown', this._onMouseDown.bind(this));
		this.app.renderer.plugins.interaction.on('mouseup', this._onMouseUp.bind(this));
		this.app.renderer.plugins.interaction.on('mouseupoutside', this._onMouseUp.bind(this));
		this.initKeyboard();
		this.app.ticker.add((delta) => {
			this.onMouseMove();
		});
	}

	initKeyboard() {
		var left 	= Keyboard([37, 81]),
			up		= Keyboard([38, 90]),
			right 	= Keyboard([39, 68]),
			down 	= Keyboard([40, 83]);

		var velocityChange = () => {
			this.emit('velocityChange', {
				vx: this.vx,
				vy: this.vy
			});
		}
		var goRight = () => {
			this.vx += 1;
			velocityChange();
		}, goLeft = () => {
			this.vx -= 1;
			velocityChange();
		}, goUp = () => {
			this.vy -= 1;
			velocityChange();
		}, goDown = () => {
			this.vy += 1;
			velocityChange();
		};

		left.press = goLeft;
		left.release = goRight;
		right.press = goRight;
		right.release = goLeft;
		up.press = goUp;
		up.release = goDown;
		down.press = goDown;
		down.release = goUp;
	}

	canFire() {
		var time = (new Date()).getTime();
		if (time - this.lastfireTime >= 1000 / this.bullet.rate) {
			this.lastfireTime = time;
			//console.log('fire !');
			return true;
		} else {
			//console.log('not allowed to shoot');
			return false;
		}
	}

	fire(x, y) {
		if (!this.canFire()) {
			return;
		}
		var alpha = this.renderer.cannon.rotation + this.renderer.base.rotation;
		this.emit('shoot', {
			angle: alpha
		});
	}

	shoot(x, y, alpha) {
		var bullet = new Bullet(this.app, x, y, alpha, this.options);
		bullet.once('bulletOut', () => {
			bullet.renderer.bullet.destroy();
			delete bullet.renderer;
			bullet = null;
		});
		this.renderer.cannon.rotation = alpha - this.renderer.base.rotation;
		this.alpha = alpha;
	}

	setVelocity(data) {
		this.vx = data.vx;
		this.vy = data.vy;
	}

	_onMouseDown(e) {
		this._onMouseUp();
		var mousePosition = e.data.global;
		this.fireInterval = setInterval(() => {
			this.fire(mousePosition.x, mousePosition.y);
		}, (1000 / this.bullet.rate) + 5);
		this.fire(mousePosition.x, mousePosition.y);
		this.emit('fireStart', mousePosition);
	}

	_onMouseUp(e) {
		clearInterval(this.fireInterval);
		this.fireInterval = 0;
		this.emit('fireEnd');
	}

	onMouseMove() {
		var limits = window.tankGame.limits;
		var mousePosition = this.app.renderer.plugins.interaction.mouse.global;
		var deltaX = mousePosition.x - this.renderer.tank.position.x - limits.x;
		var deltaY = mousePosition.y - this.renderer.tank.position.y - limits.y;
		var cannonAngle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
		this.renderer.cannon.rotation = cannonAngle - this.renderer.base.rotation;
	}

	toJson() {
		return {
			hp: this.hp,
			maxHp: this.maxHp,
			shield: this.shield,
			speed: this.speed,
			id: this.id,
			type: this.type,
			x: this.x,
			y: this.y,
		}
	}
}

module.exports = Tank;