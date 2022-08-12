import * as PIXI from 'pixi.js';
import { GameInstance } from '../../engine/core/GameInstance';
import { randomInteger } from '../../engine/math/math';

export enum EFloorType
{
    None,
    Dirt,
    Stone,
    Grass,
    Sand,
    Snow,
    Water,
    StoneFloor,
    Planks
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

    constructor()
    {

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
                else if (randNumber == 4)
                {
                    floorTile = EFloorType.Water;
                }
                else if (randNumber == 5 && (this.biome == EBiomeType.Snow || this.biome == EBiomeType.Forest))
                {
                    floorTile = EFloorType.Dirt;
                }
                else if (randNumber == 6)
                {
                    floorTile = EFloorType.Sand;
                }

                this.tileData[x][y] = new WorldTileData(floorTile);
            }
        }
    }

    getTileAt(x: number, y: number): WorldTileData | null
    {
        const arrayX = this.tileData[x];

        if (!arrayX)
        {
            return null;
        }

        return arrayX[y] || null;
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