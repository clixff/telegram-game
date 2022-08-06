import { CameraManager } from "../../engine/camera/CameraManager";
import { KeyboardManager } from "../../engine/controls/KeyboardManager";
import { GameInstance, IVector } from "../../engine/core/GameInstance";
import { PlayerController } from "../../engine/player/PlayerController";
import { Actor } from "../../engine/scene/actors/Actor";
import { JoystickContainer } from "../ui/GameUI";

export class GamePlayerController extends PlayerController
{
    actor: Actor | null = null;
    constructor()
    {
        super();

        const gameInstance = GameInstance.Get();

        if (gameInstance)
        {
            gameInstance.getApp().ticker.add(() =>
            {
                this.tick(gameInstance.getApp().ticker.elapsedMS);
            });
        }
    }

    move(offset: IVector): void
    {
        const gameInstance = GameInstance.Get();

        if (gameInstance)
        {
            if (this.actor)
            {
                this.actor.addVelocity(offset);
            }
        }
    }

    onKeyEvent(code: string, isDown: boolean): void
    {
        super.onKeyEvent(code, isDown);

        // if(isDown)
        // {
        //     switch (code)
        //     {
        //         case 'KeyW':
        //             this.move({ x: 0, y: -1 });
        //             break;
        //         case 'KeyD':
        //             this.move({ x: 1, y: 0 });
        //             break;
        //         case 'KeyS':
        //             this.move({ x: 0, y: 1 });
        //             break;
        //         case 'KeyA':
        //             this.move({ x: -1, y: 0 });
        //             break;
        //     }
        // }
    }

    tick(deltaTime: number): void
    {
        const keyboardManager = KeyboardManager.Get();

        if (keyboardManager.isKeyDown('KeyW'))
        {
            this.move({ x: 0, y: -1 });
        }

        if (keyboardManager.isKeyDown('KeyD'))
        {
            this.move({ x: 1, y: 0 });
        }

        if (keyboardManager.isKeyDown('KeyS'))
        {
            this.move({ x: 0, y: 1 });
        }

        if (keyboardManager.isKeyDown('KeyA'))
        {
            this.move({ x: -1, y: 0 });
        }

        const jostickVector = JoystickContainer.getThumbVector();

        if (jostickVector.x !== 0.0 || jostickVector.y !== 0.0)
        {
            // this.move(jostickVector);

            if (this.actor)
            {
                this.actor.velocity = jostickVector;
            }
        }
    }
}