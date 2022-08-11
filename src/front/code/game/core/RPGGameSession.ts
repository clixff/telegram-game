import { CameraManager } from "../../engine/camera/CameraManager";
import { GameInstance } from "../../engine/core/GameInstance";
import { GameScene } from "../../engine/scene/GameScene";
import { Pawn } from "../pawn/Pawn";
import { GamePlayerController } from "../player/GamePlayerController";
import { GameUI } from "../ui/GameUI";
import { TreesWrapper } from "../world/Trees";
import { WorldTile } from "../world/WorldTile";

export class RPGGameSession
{
    scene: GameScene | null = null;
    playerPawn: Pawn | null = null;
    playerController: GamePlayerController | null = null;
    gameUI: GameUI | null = null;
    worldTile: WorldTile | null = null;

    constructor()
    {
        
    }

    Init()
    {
        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        this.scene = new GameScene();

        gameInstance.loadScene(this.scene);

        this.playerPawn = this.scene.spawnActor(Pawn, true);
        this.worldTile = this.scene.spawnActor(WorldTile, true);


        this.playerController = gameInstance.initPlayerController(GamePlayerController);
        this.playerController.actor = this.playerPawn;
	    CameraManager.Get().attachedActor = this.playerPawn;

        this.gameUI = new GameUI();

        gameInstance.addUIScene(this.gameUI);
    }
}