import { ResolverAssetsArray } from "@pixi/assets";
import { GameInstance } from "../../engine/core/GameInstance";
import { LoadingUI } from "../ui/LoadingUI";
import { RPGGameSession } from "./RPGGameSession";

export class RPGGameInstance extends GameInstance
{
    gameSession: RPGGameSession | null = null;
    loadingUI: LoadingUI;
    constructor()
    {
        super();
        this.loadingUI = new LoadingUI();
        this.addUIScene(this.loadingUI);
    }

    async Init(assets: ResolverAssetsArray): Promise<void>
    {
        try
        {
            await this.preloadAssets(assets);

            this.createGameSession();
        }
        catch (error)
        {
            console.error(error);
        }
    }

    createGameSession()
    {
        this.gameSession = new RPGGameSession();
        this.gameSession.Init();
    }

    
    onAssetsLoadingProgress(progress: number): void
    {
        super.onAssetsLoadingProgress(progress);
        this.loadingUI.updateText(progress);
    }

    onAssetsLoaded(): void 
    {
        super.onAssetsLoaded();

        this.getApp().stage.removeChild(this.loadingUI);
    }
}
    