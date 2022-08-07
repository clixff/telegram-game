// import { BatchPluginFactory, Container, Filter, ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";
import * as PIXI from 'pixi.js';
import { CompositeTilemap, settings as tileSettings } from "@pixi/tilemap";

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
        const sandTexture = gameInstance.getTextureByName('t_sand');
        const waterTexture = gameInstance.getTextureByName('t_water');
        const planksTexture = gameInstance.getTextureByName('t_planks');

        const textureSize = 16;
        const tileSize = 128;

        const maxX = 128;
        const maxY = 128;

        const compositeTilemap = new CompositeTilemap();
        
        compositeTilemap.scale.set(tileSize / textureSize);

        this.getContainer().addChild(compositeTilemap);

        for (let x = 0; x < maxX; x++)
        {
            for (let y = 0; y < maxY; y++)
            {
                const rand = randomInteger(0, 35);
                let texture = grassTexture;

                if (rand <= 2)
                {
                    texture = waterTexture;
                }
                else if (rand == 4)
                {
                    texture = sandTexture;
                }
                else if (rand == 5)
                {
                    texture = dirtTexture;
                }
                else if (rand == 6)
                {
                    texture = planksTexture;
                }

                if (!texture)
                {
                    continue;
                }

                compositeTilemap.tile(texture, x * textureSize, y * textureSize, {
                    tileHeight: textureSize,
                    tileWidth: textureSize
                });
            }
        }

        const bounds = { x: 0, y: 0 };

        bounds.x = tileSize * maxX;
        bounds.y = tileSize * maxY;

        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);
    }
}