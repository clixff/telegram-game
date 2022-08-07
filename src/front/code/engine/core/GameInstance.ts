import { GameScene } from "../scene/GameScene";
import * as PIXI from 'pixi.js';

import { Assets, ResolverAssetsArray } from '@pixi/assets';
import { KeyboardManager } from "../controls/KeyboardManager";
import { PlayerController } from "../player/PlayerController";
import { CameraManager } from "../camera/CameraManager";
import { UIScene } from "../ui/UIScene";
import { settings as tileSettings } from '@pixi/tilemap'
import { getTelegramWebApp } from "../thirdParty/telegram/telegram";

export interface IAssetData
{
    [key: string]: PIXI.Texture;
}

export interface IVector
{
    x: number;
    y: number;
}


export class GameInstance
{
    private _currentGameScene: GameScene | null = null;
    private app: PIXI.Application;
    private static Singleton: GameInstance | null = null;
    private assets: IAssetData = {};
    private keyboardManager: KeyboardManager;
    private playerController: PlayerController | null = null;

    constructor()
    {
        if (GameInstance.Singleton)
        {
            throw new Error('GameInstance already exists');
        }

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        
        tileSettings.TEXTILE_SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        tileSettings.use32bitIndex = true;
        tileSettings.TEXTURES_PER_TILEMAP = 16;

        const telegramApp = getTelegramWebApp();

        if (telegramApp)
        {
            telegramApp.expand();
            telegramApp.ready();
        }
    

        GameInstance.Singleton = this;
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x171717,
            resolution: window.devicePixelRatio || 1,
            view: document.getElementById('root') as HTMLCanvasElement,
            autoDensity: true,
            resizeTo: window
        });

        this.keyboardManager = new KeyboardManager();
        new CameraManager();
        this.app.stage.sortableChildren = true;
    }

    static Get(): GameInstance | null
    {
        return GameInstance.Singleton;
    }

    loadScene(_gameScene: GameScene): void
    {
        if (this._currentGameScene)
        {
            this.app.stage.removeChild(this._currentGameScene);
            this._currentGameScene.destroy();
        }

        this._currentGameScene = _gameScene;
        this.app.stage.addChildAt(_gameScene, 0);
        _gameScene.zIndex = 0;
    }

    getGameScene(): GameScene | null
    {
        return this._currentGameScene;
    }

    getApp(): PIXI.Application
    {
        return this.app;
    }

    async preloadAssets(assets: ResolverAssetsArray): Promise<void>
    {
        try
        {
            await Assets.init({
                manifest: 
                {
                    bundles: 
                    [{
                        name: 'main',
                        assets: assets
                    }]
                }
            });
    
            const bundle = await Assets.loadBundle('main');
            this.assets = bundle;
            console.log(this.assets);
        }
        catch (error)
        {
            error
        }
    }

    getTextureByName(name: string): PIXI.Texture | null
    {
        const texture = this.assets[name];

        return texture ? texture : null;
    }

    initPlayerController<T extends PlayerController = PlayerController>(controllerClass: { new(): T }): T
    {
        const controller = new controllerClass();
        this.playerController = controller;

        return controller;
    }

    getPlayerController(): PlayerController | null
    {
        return this.playerController;
    }

    addUIScene(scene: UIScene): void
    {
        this.app.stage.addChild(scene);
    }

    getWidth(): number
    {
        return window.innerWidth;
    }

    getHeight(): number
    {
        return window.innerHeight;
    }
}