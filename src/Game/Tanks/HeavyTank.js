import Tank from './Tank';
import HeavyTankBulletData from '../Bullets/Data/HeavyTankBulletData';
import HeavyTankData from './Data/HeavyTankData';
import MoveData from '../MoveData';
import ShootRate from '../ShootRate';

class HeavyTank extends Tank {
	constructor(game, id) {
		super(game, id);
		this.tankInfo = HeavyTankData;
		this.bulletInfo = HeavyTankBulletData;
		this.type = 3;
		this.moveData = new MoveData(this.tankInfo.speed);
		this.shootRate	= new ShootRate(this.bulletInfo.rate);
	}
}

export default HeavyTank;