import { ResolverAssetsArray } from "@pixi/assets";
import { GameInstance } from "../../engine/core/GameInstance";
import { RPGGameSession } from "./RPGGameSession";

export class RPGGameInstance extends GameInstance
{
    gameSession: RPGGameSession | null = null;
    constructor()
    {
        super();
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
}
    