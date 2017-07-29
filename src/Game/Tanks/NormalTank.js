import Tank from './Tank';
import NormalTankBulletData from '../Bullets/Data/NormalTankBulletData';
import NormalTankData from './Data/NormalTankData';
import MoveData from '../MoveData';

class NormalTank extends Tank {
	constructor(id) {
		super(id);
		this.tankInfo = NormalTankData;
		this.bulletInfo = NormalTankBulletData;
		this.type = 1;
		this.moveData = new MoveData(this.tankInfo.speed);
	}
}

export default NormalTank;