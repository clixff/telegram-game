import * as PIXI from 'pixi.js';
import { GameInstance } from "../../engine/core/GameInstance";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { TilemapComponent } from "../../engine/scene/actors/components/TilemapComponent";
import { WorldData } from "./WorldData";

export class PropsTileMap extends Actor
{
    worldData: WorldData | null = null;
    rootContainer: ContainerComponent;
    tilemapComponent: TilemapComponent | null = null;

    constructor()
    {
        super();

        this.rootContainer = new ContainerComponent(this);
        this.setRootComponent(this.rootContainer);
    }

    Init(): void
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

        
        const bounds = { x: 0, y: 0 };

        bounds.x = WorldData.TileSize * WorldData.WorldSize;
        bounds.y = WorldData.TileSize * WorldData.WorldSize;

        this.getContainer().interactive = true;
        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);

        this.tilemapComponent = new TilemapComponent(this);

        this.rootContainer.addChild(this.tilemapComponent);

        const tilemapContainer = this.tilemapComponent.container;
        tilemapContainer.setGetTilesForRenderFunction(this.worldData.getPropsTilemapsForRender);
    }

    tick(deltaTime: number): void
    {
        super.tick(deltaTime);

        if (!this.worldData)
        {
            return;
        }

        if (this.worldData.bShouldReRenderProps)
        {
            this.worldData.bShouldReRenderProps = false;
            if (this.tilemapComponent)
            {
                const tileContainer = this.tilemapComponent.container;

                tileContainer.bShouldUpdateGeometry = true;
            }
        }
    }
}