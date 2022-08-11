import './styles/style.css';
import { RPGGameInstance } from './code/game/core/RPGGameInstance';
import './code/engine/thirdParty/telegram/telegram';

const gameInstance = new RPGGameInstance();

const gameAssets = [
{
	name: 'atlas_tile',
	srcs: '/assets/tiles/atlas/tile_atlas.json'
},
{
	name: 't_shadow',
	srcs: '/assets/shadow.png',
},
{
	name: 't_pawn',
	srcs: '/assets/pawn.png',
},
{
	name: 'virtual_joystick',
	srcs: '/assets/ui/controls/joystick.json'
}];

gameInstance.Init(gameAssets);


