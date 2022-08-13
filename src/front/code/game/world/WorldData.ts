import * as PIXI from 'pixi.js';
import { GameInstance } from '../../engine/core/GameInstance';
import { clamp, dist2d, randomInteger } from '../../engine/math/math';
import { ITileData } from '../../engine/tilemap/TilemapContainer';

export enum EFloorType
{
    None = "None",
    Dirt = "Dirt",
    Stone = "Stone",
    Grass = "Grass",
    Sand = "Sand",
    Snow = "Snow",
    Water = "Water",
    StoneFloor = "StoneFloor",
    Planks = "Planks"
}

export enum EBiomeType
{
    None = 0,
    Forest = 1,
    Desert = 2,
    Snow = 3
}

interface ITileFloorData
{
    type: EFloorType;
    texture: PIXI.Texture | null;
}

/** Red, Green, Blue, Alpha */
export type LightRGBA = [number, number, number, number];

interface ILightSource
{
    radius: number;
}

interface ITilePropData
{
    id: string;
    texture: PIXI.Texture | null;
    lightSource: ILightSource | null;
}

interface ITilePropInstance
{
    prop: ITilePropData;
}

export class WorldTileData
{
    floor: ITileFloorData = WorldData.GetFloorData(EFloorType.None) || { type: EFloorType.None, texture: null };
    prop: ITilePropInstance | null = null;
    light: LightRGBA = [0, 0, 0, 1];

    constructor(floor: EFloorType)
    {
        this.floor = WorldData.GetFloorData(floor) || { type: EFloorType.None, texture: null };
    }
}


export class WorldData
{
    /** In px */
    static TileSize = 128;
    static WorldSize = 128;
    static FloorData: ITileFloorData[] = [];
    static FloorDataMap = new Map<EFloorType, ITileFloorData>();

    static PropsData: ITilePropData[] = [];
    static PropsMap = new Map<string, ITilePropData>();

    tileData: Array<Array<WorldTileData>> = [ ];
    biome = EBiomeType.None;
 
    bShouldReRenderFloor = false;
    bShouldReRenderProps = false;

    constructor()
    {
        this.getFloorTilemapsForRender = this.getFloorTilemapsForRender.bind(this);
        this.getPropsTilemapsForRender = this.getPropsTilemapsForRender.bind(this);
    }

    generateWorld()
    {
        this.biome = randomInteger(1, 3) as EBiomeType;

        let baseBiomeTile = EFloorType.Grass;

        switch (this.biome)
        {
            case EBiomeType.Snow:
                baseBiomeTile = EFloorType.Snow;
                break;
            case EBiomeType.Desert:
                baseBiomeTile = EFloorType.Sand;
                break;
            case EBiomeType.Forest:
                baseBiomeTile = EFloorType.Grass;
                break;
        }

        this.tileData = new Array(WorldData.WorldSize);

        for (let x = 0; x < WorldData.WorldSize; x++)
        {
            this.tileData[x] = new Array(WorldData.WorldSize);
            for (let y = 0; y < WorldData.WorldSize; y++)
            {
                let floorTile: EFloorType = baseBiomeTile;

                const randNumber = randomInteger(0, 35);
        
                if (randNumber == 1)
                {
                    floorTile = EFloorType.Stone;
                }
                else if (randNumber == 2)
                {
                    floorTile = EFloorType.StoneFloor;
                }
                else if (randNumber == 3)
                {
                    floorTile = EFloorType.Planks;
                }
                else if (randNumber == 4 && (this.biome !== EBiomeType.Desert))
                {
                    floorTile = EFloorType.Water;
                }
                else if (randNumber == 5 && (this.biome == EBiomeType.Snow || this.biome == EBiomeType.Forest))
                {
                    floorTile = EFloorType.Dirt;
                }
                else if (randNumber == 6 && (this.biome !== EBiomeType.Snow))
                {
                    floorTile = EFloorType.Sand;
                }

                const tile = new WorldTileData(floorTile);

                this.tileData[x][y] = tile;

                if (floorTile != EFloorType.Water)
                {
                    const randNum = randomInteger(0, 1000);
                    if (randNum <= 2)
                    {
                        tile.prop = WorldData.CreatePropInstanceById("torch");
                    }
                }
            }
        }

        
        this.bShouldReRenderFloor = true;
        this.bShouldReRenderProps = true;

        this.updateLighting();
    }

    getFloorTilemapsForRender(): Array<ITileData>
    {
        if (!this.tileData.length || !this.tileData[0].length)
        {
            return [];
        }

        const tileData: Array<ITileData> = new Array(this.tileData.length * this.tileData[0].length);

        let i = 0;

        for (let x = 0; x < this.tileData.length; x++)
        {
            for (let y = 0; y < this.tileData[x].length; y++)
            {
                const tile = this.tileData[x][y];

                if (!tile.floor.texture)
                {
                    continue;
                }

                tileData[i] = {
                    x: x * WorldData.TileSize,
                    y: y * WorldData.TileSize,
                    texture: tile.floor.texture,
                    anchor: new PIXI.Point(0.5, 0.5),
                    width: WorldData.TileSize,
                    height: WorldData.TileSize,
                    light: tile.light,
                    scale: new PIXI.Point(1, 1)
                };


                i++;
            }
        }


        return tileData;
    }

    getPropsTilemapsForRender(): Array<ITileData>
    {
        if (!this.tileData.length || !this.tileData[0].length)
        {
            return [];
        }

        const propTiles: Array<ITileData> = [];

        let i = 0;

        for (let x = 0; x < this.tileData.length; x++)
        {
            for (let y = 0; y < this.tileData[x].length; y++)
            {
                const tile = this.tileData[x][y];

                if (!tile.prop || !tile.prop.prop.texture)
                {
                    continue;
                }

                console.log(`Prop is `, tile.prop);

                propTiles.push({
                    x: x * WorldData.TileSize,
                    y: y * WorldData.TileSize,
                    texture: tile.prop.prop.texture,
                    anchor: new PIXI.Point(0.5, 0.5),
                    width: WorldData.TileSize,
                    height: WorldData.TileSize,
                    light: tile.light,
                    scale: new PIXI.Point(1, 1)
                });

                i++;
            }
        }

        console.log(`Props: `, propTiles);


        return propTiles;
    }

    getTileAt(x: number, y: number): WorldTileData | null
    {
        x += WorldData.WorldSize / 2;
        y += WorldData.WorldSize / 2;
        const arrayX = this.tileData[x];

        if (!arrayX)
        {
            return null;
        }

        return arrayX[y] || null;
    }

    onTileClicked(x: number, y: number): void
    {
        const tile = this.getTileAt(x, y);

        if (!tile)
        {
            return;
        }

        console.log(`Tile clicked at ${x}, ${y} with type ${tile.floor.type}`, tile);

        const randomTileTypes = [EFloorType.Dirt, EFloorType.Stone, EFloorType.Grass, EFloorType.Sand, EFloorType.Snow, EFloorType.Water, EFloorType.StoneFloor, EFloorType.Planks];

        this.replaceFloorTile(x, y, randomTileTypes[randomInteger(0, randomTileTypes.length - 1)]);

        if (tile.prop)
        {
            tile.prop = null;
        }
        else
        {
            tile.prop = WorldData.CreatePropInstanceById('torch');
        }


        this.updateLighting();
    }

    replaceFloorTile(x: number, y: number, newFloorType: EFloorType): void
    {
        const floorData = WorldData.GetFloorData(newFloorType);

        if (!floorData)
        {
            console.error(`Failed to set tile to type ${newFloorType}`);
            return;
        }

        const tile = this.getTileAt(x, y);

        if (!tile)
        {
            return;
        }

        tile.floor = floorData;
        this.bShouldReRenderFloor = true;

    }

    updateLighting(): void
    {
        interface ILightPropData
        {
            x: number;
            y: number;
            propInstance: ITilePropInstance;
        }

        const lightProps: ILightPropData[] = [];

        /** Clear light level for all tiles */
        for (let x = 0; x < this.tileData.length; x++)
        {
            for (let y = 0; y < this.tileData[x].length; y++)
            {
                const tile = this.tileData[x][y];

                if (tile.prop && tile.prop.prop.lightSource)
                {
                    lightProps.push({
                        x,
                        y,
                        propInstance: tile.prop
                    });
                }

                tile.light = [0, 0, 0, 1];
            }
        }

        console.log(this.tileData);

        /** Update light level for tiles around light props with radius */
        for (let i = 0; i < lightProps.length; i++)
        {
            const lightPropData = lightProps[i];
            const lightProp = lightPropData.propInstance;

            if (!lightProp.prop.lightSource)
            {
                continue;
            }

            const radius = lightProp.prop.lightSource.radius;

            for (let x = lightPropData.x - radius; x <= lightPropData.x + radius; x++)
            {
                if (x < 0 || x >= this.tileData.length)
                {
                    continue;
                }

                for (let y = lightPropData.y - radius; y <= lightPropData.y + radius; y++)
                {
                    if (y < 0 || y >= this.tileData[x].length)
                    {
                        continue;
                    }

                    const tile = this.tileData[x][y];

                    if (!tile)
                    {
                        continue;
                    }

                    let dist = dist2d(lightPropData.x, lightPropData.y, x, y);
                    
                    if (dist > radius)
                    {
                        continue;
                    }
                    
                    // dist = Math.floor(dist);
                    
                    const distScale = clamp(1 - dist / radius, 0, 1);
                    
                    const color: LightRGBA = [ 1, 0.925, 0.05, 1 * distScale ];

                    const lightIntensity = 1;
                    
                    const light = tile.light;
                    light[0] += color[0] * (lightIntensity * distScale);
                    light[1] += color[1] * (lightIntensity * distScale);
                    light[2] += color[2] * (lightIntensity * distScale);

                    // light[0] = clamp(light[0], 0, 1);
                    // light[1] = clamp(light[1], 0, 1);
                    // light[2] = clamp(light[2], 0, 1);
                    light[3] = clamp(lightIntensity, 0, 1);

                    tile.light = light;
                }
            }
        }

        this.bShouldReRenderFloor = true;
        this.bShouldReRenderProps = true;
    }

    static Init()
    {
        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            console.error(`Failed to init WorldData tiles. GameInstance is null.`);
            return;
        }

        const spriteSheetName = 'atlas_tile';

        WorldData.FloorData = [
            {
                type: EFloorType.None,
                texture: null
            },
            {
                type: EFloorType.Dirt,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'dirt')
            },
            {
                type: EFloorType.Stone,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'stone')
            },
            {
                type: EFloorType.Grass,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'grass')
            },
            {
                type: EFloorType.Sand,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'sand')
            },
            {
                type: EFloorType.Snow,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'snow')
            },
            {
                type: EFloorType.Water,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'water')
            },
            {
                type: EFloorType.StoneFloor,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'stone_floor')
            },
            {
                type: EFloorType.Planks,
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'planks')
            }
        ];

        WorldData.FloorDataMap = new Map<EFloorType, ITileFloorData>();
        WorldData.FloorData.forEach(floor => WorldData.FloorDataMap.set(floor.type, floor));

        WorldData.PropsData = [
            {
                id: 'torch',
                texture: gameInstance.getTextureInSpriteSheet(spriteSheetName, 'torch'),
                lightSource: 
                {
                    radius: 6
                }
            }
        ];

        WorldData.PropsMap = new Map<string, ITilePropData>();
        WorldData.PropsData.forEach(prop => WorldData.PropsMap.set(prop.id, prop));
    }

    static GetFloorData(type: EFloorType): ITileFloorData | null
    {
        return WorldData.FloorDataMap.get(type) || null;
    }

    static GetPropById(id: string): ITilePropData | null
    {
        return WorldData.PropsMap.get(id) || null;
    }

    static CreatePropInstanceById(id: string): ITilePropInstance | null
    {
        const propData = WorldData.GetPropById(id);

        if (!propData)
        {
            return null;
        }

        return {
            prop: propData
        };
    }

}