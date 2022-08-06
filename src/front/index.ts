import './styles/style.css';
import { Application, Texture, Sprite, Container, Graphics, TextStyle, Text, settings } from 'pixi.js';
import { BlurFilter } from '@pixi/filter-blur';
import { GameInstance } from './code/engine/core/GameInstance';
import { GameScene } from './code/engine/scene/GameScene';
import { Actor } from './code/engine/scene/actors/Actor';
import { SpriteComponent } from './code/engine/scene/actors/components/SpriteComponent';
import { PlayerController } from './code/engine/player/PlayerController';
import { GamePlayerController } from './code/game/player/GamePlayerController';
import { CameraManager } from './code/engine/camera/CameraManager';
import { GameUI } from './code/game/ui/GameUI';
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
	name: 't_tree',
	srcs: '/assets/tree.png',
},
{
	name: 't_pawn',
	srcs: '/assets/pawn_2.png',
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


