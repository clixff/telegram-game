// import { BatchPluginFactory, Container, Filter, ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";
import * as PIXI from 'pixi.js';
import { CompositeTilemap, settings as tileSettings } from "@pixi/tilemap";
import { TilemapContainer } from "../../engine/tilemap/TilemapContainer";

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

        const spriteSheetName = 'atlas_tile';

        const grassTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'grass');
        const dirtTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'dirt');
        const sandTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'sand');
        const waterTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'water');
        const planksTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'planks');
        const snowTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'snow');
        const stoneTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'stone');
        const stoneFloorTexture = gameInstance.getTextureInSpriteSheet(spriteSheetName, 'stone_floor');

        const tileSize = 128;

        const maxX = 128;
        const maxY = 128;

        const tilemapContainer = new TilemapContainer();
        
        // tilemapContainer.scale.set(tileSize / textureSize);

        this.getContainer().addChild(tilemapContainer);

        for (let x = 0; x < maxX; x++)
        {
            for (let y = 0; y < maxY; y++)
            {
                let rand = randomInteger(0, 35);
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
                else if (rand == 7)
                {
                    texture = snowTexture;
                }
                else if (rand == 9)
                {
                    texture = stoneTexture;
                }
                else if (rand == 10)
                {
                    texture = stoneFloorTexture;
                }

                if (!texture)
                {
                    continue;
                }

                tilemapContainer.addTile(texture, x * tileSize, y * tileSize, {
                    height: tileSize,
                    width: tileSize,
                    anchor: new PIXI.Point(0.5, 0.5),
                    light: [0, 0, 0, 1],
                    scale: new PIXI.Point(1, 1)
                });
            }
        }

        

        const bounds = { x: 0, y: 0 };

        bounds.x = tileSize * maxX;
        bounds.y = tileSize * maxY;

        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);
    }
}