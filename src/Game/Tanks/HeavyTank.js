import Tank from './Tank';
import HeavyTankBulletData from '../Bullets/Data/HeavyTankBulletData';
import HeavyTankData from './Data/HeavyTankData';

class HeavyTank extends Tank {
	constructor(id) {
		super(id);
		this.tankData = HeavyTankData;
		this.bulletData = HeavyTankBulletData;
		this.type = 3;
	}
}

export default HeavyTank;