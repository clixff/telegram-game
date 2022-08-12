import { CameraManager } from "../../engine/camera/CameraManager";
import { GameInstance } from "../../engine/core/GameInstance";
import { SkyLightActor } from "../../engine/light/SkyLight";
import { GameScene } from "../../engine/scene/GameScene";
import { Pawn } from "../pawn/Pawn";
import { GamePlayerController } from "../player/GamePlayerController";
import { DayTimeActor } from "../time/DayTime";
import { GameUI } from "../ui/GameUI";
import { TreesWrapper } from "../world/Trees";
import { WorldData } from "../world/WorldData";
import { FloorTileMap } from "../world/WorldTile";

export class RPGGameSession
{
    scene: GameScene | null = null;
    playerPawn: Pawn | null = null;
    playerController: GamePlayerController | null = null;
    gameUI: GameUI | null = null;
    floorTileMap: FloorTileMap | null = null;
    worldData: WorldData | null = null;

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

        this.worldData = new WorldData();
        WorldData.Init();
        this.worldData.generateWorld();

        const skyLight = this.scene.spawnActor(SkyLightActor, true);

        const dayTimeActor = this.scene.spawnActor(DayTimeActor, true);
        dayTimeActor.skyLightActorRef = skyLight;
        dayTimeActor.updateBiome(this.worldData.biome);

        this.playerPawn = this.scene.spawnActor(Pawn, true);

        this.floorTileMap = this.scene.spawnActor(FloorTileMap, true);
        this.floorTileMap.worldData = this.worldData;
        this.floorTileMap.init();

        this.playerController = gameInstance.initPlayerController(GamePlayerController);
        this.playerController.actor = this.playerPawn;
	    CameraManager.Get().attachedActor = this.playerPawn;

        this.gameUI = new GameUI();

        gameInstance.addUIScene(this.gameUI);
    }
}