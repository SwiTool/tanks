import MiniTankData from './Data/MiniTankData';
import NormalTankData from './Data/NormalTankData';
import HeavyTankData from './Data/HeavyTankData';

import MiniTankBulletData from '../Bullets/Data/MiniTankBulletData';
import NormalTankBulletData from '../Bullets/Data/NormalTankBulletData';
import HeavyTankBulletData from '../Bullets/Data/HeavyTankBulletData';

export default [
	{
		_id: 1,
		img: "img/preview-tank-1.png",
		base: "img/tank-1-base.png",
		cannon: "img/tank-1-cannon.png",
		bullet: "img/tank-1-bullet.png",
		type: 1,
		tankInfo: NormalTankData,
		bulletInfo: NormalTankBulletData
	},
	{
		_id: 2,
		img: "img/preview-tank-2.png",
		base: "img/tank-2-base.png",
		cannon: "img/tank-2-cannon.png",
		bullet: "img/tank-2-bullet.png",
		type: 2,
		tankInfo: MiniTankData,
		bulletInfo: MiniTankBulletData
	},
	{
		_id: 3,
		img: "img/preview-tank-3.png",
		base: "img/tank-3-base.png",
		cannon: "img/tank-3-cannon.png",
		bullet: "img/tank-3-bullet.png",
		type: 3,
		tankInfo: HeavyTankData,
		bulletInfo: HeavyTankBulletData
	}
];
