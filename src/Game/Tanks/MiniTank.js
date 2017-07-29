import Tank from './Tank';
import MiniTankBulletData from '../Bullets/Data/MiniTankBulletData';
import MiniTankData from './Data/MiniTankData';
import MoveData from '../MoveData';

class MiniTank extends Tank {
	constructor(id) {
		super(id);
		this.tankInfo = MiniTankData;
		this.bulletInfo = MiniTankBulletData;
		this.type = 2;
		this.moveData = new MoveData(this.tankInfo.speed);
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