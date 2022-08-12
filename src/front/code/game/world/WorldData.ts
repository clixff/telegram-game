import * as PIXI from 'pixi.js';
import { GameInstance } from '../../engine/core/GameInstance';
import { randomInteger } from '../../engine/math/math';
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


export class WorldTileData
{
    floor: ITileFloorData = WorldData.GetFloorData(EFloorType.None) || { type: EFloorType.None, texture: null };

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

    tileData: Array<Array<WorldTileData>> = [ ];
    biome = EBiomeType.None;

    bShouldReRenderFloor = false;

    constructor()
    {
        this.getFloorTilemapsForRender = this.getFloorTilemapsForRender.bind(this);
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

                this.tileData[x][y] = new WorldTileData(floorTile);
            }
        }

        this.bShouldReRenderFloor = true;
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
                    light: [0, 0, 0, 1],
                    scale: new PIXI.Point(1, 1)
                };


                i++;
            }
        }

        return tileData;
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

        const randomTileTypes = [...WorldData.FloorDataMap.keys()];

        this.replactFloorTile(x, y, randomTileTypes[randomInteger(0, randomTileTypes.length - 1)]);
    }

    replactFloorTile(x: number, y: number, newFloorType: EFloorType): void
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
    }

    static GetFloorData(type: EFloorType): ITileFloorData | null
    {
        return WorldData.FloorDataMap.get(type) || null;
    }
}