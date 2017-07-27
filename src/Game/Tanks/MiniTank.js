import Tank from './Tank';
import MiniTankBulletData from '../Bullets/Data/MiniTankBulletData';
import MiniTankData from './Data/MiniTankData';

class MiniTank extends Tank {
	constructor(id) {
		super(id);
		this.tankData = MiniTankData;
		this.bulletData = MiniTankBulletData;
		this.type = 2;
	}

	getSpriteOffsetX() {
		return 30;
	}

	getSpriteOffsetY() {
		return 30;
	}
}

export default MiniTank;