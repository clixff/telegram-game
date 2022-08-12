// import { BatchPluginFactory, Container, Filter, ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";
import * as PIXI from 'pixi.js';
import { CompositeTilemap, settings as tileSettings } from "@pixi/tilemap";
import { TilemapContainer } from "../../engine/tilemap/TilemapContainer";
import { WorldData } from "./WorldData";

export class FloorTileMap extends Actor
{
    spriteComponent: SpriteComponent | null = null;
    worldData: WorldData | null = null;
    constructor()
    {
        super();
    }

    init()
    {
        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        if (!this.worldData)
        {
            return;
        }
        
        const tilemapContainer = new TilemapContainer();

        this.getContainer().addChild(tilemapContainer);

        for (let x = 0; x < WorldData.WorldSize; x++)
        {
            for (let y = 0; y < WorldData.WorldSize; y++)
            {
                const tile = this.worldData.tileData[x][y];
                const texture = tile.floor.texture;

                console.log(texture);

                if (!texture)
                {
                    continue;
                }

                tilemapContainer.addTile(texture, x * WorldData.TileSize, y * WorldData.TileSize, {
                    height: WorldData.TileSize,
                    width: WorldData.TileSize,
                    anchor: new PIXI.Point(0.5, 0.5),
                    light: [0, 0, 0, 1],
                    scale: new PIXI.Point(1, 1)
                });
            }
        }

        const bounds = { x: 0, y: 0 };

        bounds.x = WorldData.TileSize * WorldData.WorldSize;
        bounds.y = WorldData.TileSize * WorldData.WorldSize;

        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);
    }
}