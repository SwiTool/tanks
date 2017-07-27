var PIXI = require('pixi.js');

class TankRenderer {
	constructor(app, base, cannon, options) {
		this.app = app;
		this.tank = new PIXI.Container();
		this.text = null;
		this.healthBar = null;
		this.options = options;

		this.initHealthBar(options.hp, options.maxHp);
		this.initBase(base);
		this.initCannon(cannon);
		this.setName(options.id);
		this.setPosition(options.x, options.y);
		//this.app.stage.addChild(this.tank);
		window.tankGame.gameContainer.addChild(this.tank);
	}

	initBase(base) {
		this.base = PIXI.Sprite.fromImage(base);
		this.base.anchor.set(0.5);
		this.base.interactive = true;
		this.tank.addChild(this.base);
	}

	initCannon(cannon) {
		this.cannon = PIXI.Sprite.fromImage(cannon);
		this.cannon.anchor.set(0.5, 0.8);
		this.cannon.interactive = true;
		this.base.addChild(this.cannon);
	}

	initHealthBar() {
		this.healthBar = new PIXI.Graphics();
		this.setHealthBar(100);
		this.tank.addChild(this.healthBar);
	}

	updateHealth(hp) {
		if (hp > this.options.maxHp) {
			hp = this.options.maxHp;
		}
		if (hp < 0) {
			hp = 0;
		}
		var pct = hp * 100 / this.options.maxHp;
		var color = this.getHealthBarColor(pct);
		this.healthBar.clear();
		this.setHealthBar(pct, color);
	}

	setHealthBar(pct, color) {
		if (color == undefined) {
			color = "00FF00";
		}
		this.healthBar.lineStyle(1, 0x000000, 0.5);
		this.healthBar.drawRect(-50, -75, 100, 6);
		this.healthBar.lineStyle(0);
		this.healthBar.beginFill(parseInt(color, 16), 0.5);
		this.healthBar.drawRect(-50, -75, pct, 6);
		this.healthBar.endFill();
	}

	setPosition(x, y) {
		this.tank.position.x = x;
		this.tank.position.y = y;
	}

	setName(name) {
		var style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 15,
			fontWeight: 'bold',
			stroke: '#000000',
		    strokeThickness: 2,
		    fill: '#ffffff'
		});

		this.text = new PIXI.Text(name, style);

		this.text.anchor.set(0.5);

		this.text.y = -85;
		this.tank.addChild(this.text);
	}

	getHealthBarColor(percent) {
		var r = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
		var g = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
		var color = this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(0);
		return color;
	}

	componentToHex(c) {
    	var hex = c.toString(16);
    	return hex.length == 1 ? "0" + hex : hex;
	}
}

export default TankRenderer;