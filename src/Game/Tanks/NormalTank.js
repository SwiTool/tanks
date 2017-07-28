import Tank from './Tank';
import NormalTankBulletData from '../Bullets/Data/NormalTankBulletData';
import NormalTankData from './Data/NormalTankData';

class NormalTank extends Tank {
	constructor(id) {
		super(id);
		this.tankInfo = NormalTankData;
		this.bulletInfo = NormalTankBulletData;
		this.type = 1;
	}
}

export default NormalTank;