import { ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";

export class WorldTile extends Actor
{
    spriteComponent: SpriteComponent | null = null;
    constructor()
    {
        super();

        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        const grassTexture = gameInstance.getTextureByName('t_grass');
        const dirtTexture = gameInstance.getTextureByName('t_dirt');

        if (!grassTexture || !dirtTexture)
        {
            return;
        }

        // const containerComponent = new ContainerComponent(this);
        // this.setRootComponent(containerComponent);

        const containerComponent = new ParticleContainer(100000);
    
        this.getContainer().addChild(containerComponent);



        const maxX = 128;
        const maxY = 128;

        for (let x = 0; x < maxX; x++)
        {
            for (let y = 0; y < maxY; y++)
            {
                const texture = randomInteger(0, 10) ? grassTexture : grassTexture;
                const spriteComponent = new SpriteComponent(this, texture);
                spriteComponent.getSprite().position.set(x * texture.width, y * texture.height);
                spriteComponent.getSprite().anchor.set(0.5, 0.5);
                containerComponent.addChild(spriteComponent.getSprite());
            }
        }

        const bounds = { x: 0, y: 0 };

        bounds.x = 128 * maxX;
        bounds.y = 128 * maxY;

        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);

    }
}