import './styles/style.css';
import { RPGGameInstance } from './code/game/core/RPGGameInstance';

interface ITelegramApp
{

}

interface IWindowTelegramApp
{
	Telegram?:
	{
		WebApp: ITelegramApp;
	}
}


let telegramApp: ITelegramApp | null = null;

if (window)
{
	const tg = (window as IWindowTelegramApp).Telegram;
	if (tg && tg.WebApp)
	{
		telegramApp = tg.WebApp;
	}
}

console.log(telegramApp);

const gameInstance = new RPGGameInstance();

const gameAssets = [{
	name: 't_grass',
	srcs: '/assets/grass.png',
},
{
	name: 't_dirt',
	srcs: '/assets/dirt.png',
},
{
	name: 't_tile',
	srcs: '/assets/tile.png',
},
{
	name: 't_tree',
	srcs: '/assets/tree.png',
},
{
	name: 't_sand',
	srcs: '/assets/sand.png',
},
{
	name: 't_water',
	srcs: '/assets/water.png',
},
{
	name: 't_shadow',
	srcs: '/assets/shadow.png',
},
{
	name: 't_planks',
	srcs: '/assets/planks.png',
},
{
	name: 't_pawn',
	srcs: '/assets/pawn.png',
},
{
	name: 'ui_joystick_bg',
	srcs: '/assets/ui/controls/joystick_bg.png',
},
{
	name: 'ui_joystick_thumb',
	srcs: '/assets/ui/controls/joystick_thumb.png',
}];


gameInstance.Init(gameAssets);


