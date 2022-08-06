import { GameInstance, IVector } from "../core/GameInstance";
import { Actor } from "../scene/actors/Actor";

export class CameraManager
{
    private static Singleton: CameraManager;
    attachedActor: Actor | null = null;
    constructor()
    {
        CameraManager.Singleton = this;

        const gameInstance = GameInstance.Get();
        if (gameInstance)
        {
            gameInstance.getApp().ticker.add(() =>
            {
                this.tick(gameInstance.getApp().ticker.elapsedMS);
            })
        }
    }

    static Get(): CameraManager
    {
        return CameraManager.Singleton;
    }

    setCameraLocation(x: number, y: number): void
    {
        const gameInstance = GameInstance.Get();
        if (!gameInstance)
        {
            return;
        }

        const scene = gameInstance.getGameScene();

        if (!scene)
        {
            return;
        }

        scene.setSceneOffset(x * -1.0, y * -1.0);
    }

    getCameraLocation(): IVector
    {
        const gameInstance = GameInstance.Get();
        if (!gameInstance)
        {
            return { x: 0, y: 0 };
        }

        const scene = gameInstance.getGameScene();

        if (!scene)
        {
            return { x: 0, y: 0 };
        }

        const offset = scene.getSceneOffset();

        return { x: offset.x * -1.0, y: offset.y * -1.0 };
    }

    centerCameraAtActor(actor: Actor): void
    {
        if (!actor)
        {
            return;
        }

        this.setCameraLocation(actor.location.x, actor.location.y);
    }

    tick(deltaTime: number): void
    {
        if (this.attachedActor)
        {
            this.centerCameraAtActor(this.attachedActor);
        }
    }
}