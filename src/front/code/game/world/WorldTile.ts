// import { BatchPluginFactory, Container, Filter, ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";
import * as PIXI from 'pixi.js';
import { WorldData } from "./WorldData";
import { InteractiveRectComponent } from "../../engine/scene/actors/components/InteractiveRectComponent";
import { TilemapComponent } from "../../engine/scene/actors/components/TilemapComponent";


export class FloorTileMap extends Actor
{
    spriteComponent: SpriteComponent | null = null;
    worldData: WorldData | null = null;
    rootContainer: ContainerComponent;
    tilemapComponent: TilemapComponent | null = null;
    worldRect: InteractiveRectComponent | null = null;
    constructor()
    {
        super();

        this.rootContainer = new ContainerComponent(this);
        this.setRootComponent(this.rootContainer);
        this.onPointerUp = this.onPointerUp.bind(this);
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

        
        const bounds = { x: 0, y: 0 };

        bounds.x = WorldData.TileSize * WorldData.WorldSize;
        bounds.y = WorldData.TileSize * WorldData.WorldSize;

        this.getContainer().interactive = true;
        this.getContainer().pivot.set(bounds.x / 2, bounds.y / 2);

        this.tilemapComponent = new TilemapComponent(this);

        this.rootContainer.addChild(this.tilemapComponent);

        const tilemapContainer = this.tilemapComponent.container;
        tilemapContainer.setGetTilesForRenderFunction(this.worldData.getFloorTilemapsForRender);

        this.worldRect = new InteractiveRectComponent(this);
        
        const tileSize = WorldData.TileSize;
        const tileOffset = new PIXI.Point().set(tileSize * 0.5, tileSize * 0.5);

        this.worldRect.setRect(0 - tileOffset.x, 0 - tileOffset.y, tileSize * WorldData.WorldSize, tileSize * WorldData.WorldSize);

        this.rootContainer.addChild(this.worldRect);

        this.worldRect.on('pointerdown', (event) =>
        {
            // console.log(`Pointer down`, event);
        });
        
        this.worldRect.on('pointerup', this.onPointerUp);
    }

    onPointerUp(event: PIXI.InteractionEvent): void
    {
        console.log(`Pointer up`, event);

        const screenPosition: PIXI.Point = event.data.global;

        const worldPosition = this.getContainer().toLocal(screenPosition);
        worldPosition.x += WorldData.TileSize / 2.0;
        worldPosition.y += WorldData.TileSize / 2.0;
        worldPosition.x -= (WorldData.TileSize * WorldData.WorldSize) / 2;
        worldPosition.y -= (WorldData.TileSize * WorldData.WorldSize) / 2;

        const tilePosition = worldPosition;
        tilePosition.x = Math.floor(worldPosition.x / WorldData.TileSize);
        tilePosition.y = Math.floor(worldPosition.y / WorldData.TileSize);

        if (!this.worldData)
        {
            return;
        }

        this.worldData.onTileClicked(tilePosition.x, tilePosition.y);
        
    }

    tick(deltaTime: number): void
    {
        super.tick(deltaTime);

        if (!this.worldData)
        {
            return;
        }

        if (this.worldData.bShouldReRenderFloor)
        {
            this.worldData.bShouldReRenderFloor = false;
            if (this.tilemapComponent)
            {
                const tileContainer = this.tilemapComponent.container;

                tileContainer.bShouldUpdateGeometry = true;
            }
        }
    }
}