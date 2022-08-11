import { GameScene } from "../scene/GameScene";
import * as PIXI from 'pixi.js';

import { Assets, ResolverAssetsArray } from '@pixi/assets';
import { KeyboardManager } from "../controls/KeyboardManager";
import { PlayerController } from "../player/PlayerController";
import { CameraManager } from "../camera/CameraManager";
import { UIScene } from "../ui/UIScene";
import { settings as tileSettings } from '@pixi/tilemap'
import { getTelegramWebApp } from "../thirdParty/telegram/telegram";
import { TilemapRenderer } from "../tilemap/TilemapRenderer";

export interface IAssetData
{
    [key: string]: PIXI.Texture | PIXI.Spritesheet;
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

        PIXI.extensions.add({
            name: 'customTilemap',
            ref: TilemapRenderer,
            type: PIXI.ExtensionType.RendererPlugin
        });

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

        const renderer = this.app.renderer as PIXI.Renderer;

        if (renderer.gl)
        {
            renderer.globalUniforms.uniforms.globalLight = new Float32Array([0.964, 0.925, 0.819]);
        }

        this.keyboardManager = new KeyboardManager();
        new CameraManager();
        this.app.stage.sortableChildren = true;
        this.onAssetsLoadingProgress = this.onAssetsLoadingProgress.bind(this);
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
    
            const bundle = await Assets.loadBundle('main', this.onAssetsLoadingProgress);
            this.assets = bundle;
            console.log(this.assets);
            this.onAssetsLoaded();
        }
        catch (error)
        {
            error
        }
    }

    onAssetsLoadingProgress(progress: number): void
    {
    }

    onAssetsLoaded(): void
    {

    }

    getTextureByName(name: string): PIXI.Texture | null
    {
        const asset = this.assets[name] as unknown as PIXI.Texture;

        return asset ? asset : null;
    }

    getTextureInSpriteSheet(spritesheet: string, textureName: string): PIXI.Texture | null
    {
        const asset = this.assets[spritesheet] as unknown as PIXI.Spritesheet;

        if (!asset)
        {
            return null;
        }

        const texture = asset.textures[textureName];

        return texture;
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