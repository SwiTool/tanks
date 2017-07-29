import Tank from './Tank';
import NormalTankBulletData from '../Bullets/Data/NormalTankBulletData';
import NormalTankData from './Data/NormalTankData';
import MoveData from '../MoveData';
import ShootRate from '../ShootRate';

class NormalTank extends Tank {
	constructor(game, id) {
		super(game, id);
		this.tankInfo = NormalTankData;
		this.bulletInfo = NormalTankBulletData;
		this.type = 1;
		this.moveData = new MoveData(this.tankInfo.speed);
		this.shootRate	= new ShootRate(this.bulletInfo.rate);
	}
}

export default NormalTank;