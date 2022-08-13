// import { BatchPluginFactory, Container, Filter, ParticleContainer } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { randomInteger } from "../../engine/math/math";
import { Actor } from "../../engine/scene/actors/Actor";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import * as PIXI from 'pixi.js';
import { WorldData } from "./WorldData";
import { InteractiveRectComponent } from "../../engine/scene/actors/components/InteractiveRectComponent";
import { TilemapComponent } from "../../engine/scene/actors/components/TilemapComponent";

interface ITouchData
{
    /** X position of the tile */
    x: number;
    /** Y position of the tile */
    y: number;
    touchID: number;
    /** Seconds since the app start when the touch event created */
    startTime: number;
}


export class FloorTileMap extends Actor
{
    worldData: WorldData | null = null;
    rootContainer: ContainerComponent;
    tilemapComponent: TilemapComponent | null = null;
    worldRect: InteractiveRectComponent | null = null;

    touchButtonsPressed: Record<number, ITouchData> = {};

    constructor()
    {
        super();

        this.rootContainer = new ContainerComponent(this);
        this.setRootComponent(this.rootContainer);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
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

        this.worldRect.on('pointerdown', this.onPointerDown);
        
        this.worldRect.on('pointerup', this.onPointerUp);
    }

    getTilePositionByScreenPosition(x: number, y: number): PIXI.Point
    {
        const screenPosition: PIXI.Point = new PIXI.Point(x, y);

        const worldPosition = this.getContainer().toLocal(screenPosition);
        worldPosition.x += WorldData.TileSize / 2.0;
        worldPosition.y += WorldData.TileSize / 2.0;
        worldPosition.x -= (WorldData.TileSize * WorldData.WorldSize) / 2;
        worldPosition.y -= (WorldData.TileSize * WorldData.WorldSize) / 2;

        const tilePosition = worldPosition;
        tilePosition.x = Math.floor(worldPosition.x / WorldData.TileSize);
        tilePosition.y = Math.floor(worldPosition.y / WorldData.TileSize);

        return tilePosition;
    }

    getTouchButtonID(event: PIXI.InteractionEvent): number
    {
        const touchEvent = event.data.originalEvent as TouchEvent;

        if (!touchEvent.changedTouches)
        {
            return 0;
        }

        const touchData = touchEvent.changedTouches[0];

        return isFinite(touchData.identifier) ? touchData.identifier : 0;
    }

    onPointerDown(event: PIXI.InteractionEvent): void
    {
        const touchID = this.getTouchButtonID(event);
        const screenPosition = event.data.global;
        const tilePosition = this.getTilePositionByScreenPosition(screenPosition.x, screenPosition.y);

        this.touchButtonsPressed[touchID] = {
            x: tilePosition.x,
            y: tilePosition.y,
            touchID: touchID,
            startTime: performance.now() / 1000
        };
    }

    onPointerUp(event: PIXI.InteractionEvent): void
    {
        const touchID = this.getTouchButtonID(event);

        const screenPosition = event.data.global;
        const tilePosition = this.getTilePositionByScreenPosition(screenPosition.x, screenPosition.y);

        const touchData = this.touchButtonsPressed[touchID];

        if (!touchData)
        {
            return;
        }

        delete this.touchButtonsPressed[touchID];

        const timeDiff = performance.now() / 1000 - touchData.startTime;

        /** Started pressing one tile, but ended pressing an other  */
        if (tilePosition.x !== touchData.x || tilePosition.y !== touchData.y)
        {
            return;
        }

        console.log(`Time diff was ${timeDiff}`);

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