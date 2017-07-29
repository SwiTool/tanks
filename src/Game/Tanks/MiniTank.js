import Tank from './Tank';
import MiniTankBulletData from '../Bullets/Data/MiniTankBulletData';
import MiniTankData from './Data/MiniTankData';
import MoveData from '../MoveData';
import ShootRate from '../ShootRate';

class MiniTank extends Tank {
	constructor(game, id) {
		super(game, id);
		this.tankInfo = MiniTankData;
		this.bulletInfo = MiniTankBulletData;
		this.type = 2;
		this.moveData = new MoveData(this.tankInfo.speed);
		this.shootRate	= new ShootRate(this.bulletInfo.rate);
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
}

export default MiniTank;