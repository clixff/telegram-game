import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";

export class TreesWrapper extends Actor
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

        const treeTexture = gameInstance.getTextureByName('t_tree');

        if (!treeTexture)
        {
            return;
        }

        const containerComponent = new ContainerComponent(this);
        this.setRootComponent(containerComponent);


        const maxX = 128;
        const maxY = 128;

        for (let x = 0; x < maxX; x++)
        {
            for (let y = 0; y < maxY; y++)
            {
                const bSpawnTree = randomInteger(0, 10) ? false : true;

                if (!bSpawnTree)
                {
                    continue;
                }

                const spriteComponent = new SpriteComponent(this, treeTexture);
                spriteComponent.getSprite().position.set(x * treeTexture.width, y * treeTexture.height);
                spriteComponent.getSprite().anchor.set(0.5, 1);
                containerComponent.addChild(spriteComponent);

                spriteComponent.getSprite().interactive = true;
                spriteComponent.getSprite().on('pointertap', () =>
                {
                    
                    spriteComponent.getSprite().destroy();
                })
            }
        }

        const size = { x: 0, y: 0};

        size.x = size.y = 128 * maxX;

        this.getContainer().pivot.set(size.x / 2, size.y / 2);

    }
}