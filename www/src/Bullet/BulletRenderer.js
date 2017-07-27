var PIXI = require('pixi.js');

class BulletRenderer {
	constructor(app, sprite, options) {
		this.bullet = PIXI.Sprite.fromImage(sprite);
		this.bullet.scale = new PIXI.Point(0.1, 0.1);
		this.app = app;
		this.options = options;

		//this.app.stage.addChild(this.bullet);
		window.tankGame.gameContainer.addChild(this.bullet);
	}

	setPosition(x, y) {
		this.bullet.position.x = x;
		this.bullet.position.y = y;
	}
}

export default BulletRenderer;