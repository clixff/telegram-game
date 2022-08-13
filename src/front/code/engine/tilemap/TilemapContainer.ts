import * as PIXI from 'pixi.js';
import { TilemapGeometry } from './TilemapGeometry';

type lightRGBA = [number, number, number, number];


export interface ITileOptions
{
    width: number;
    height: number;
    scale: PIXI.Point;
    anchor: PIXI.Point;
    light: lightRGBA;
}

export interface ITileData extends ITileOptions
{
    texture: PIXI.Texture;
    x: number;
    y: number;
}

export class TilemapContainer extends PIXI.Container
{
    geometry: TilemapGeometry | null = null;

    getTilesForRenderCallback: (() => Array<ITileData>) | null = null;

    bShouldUpdateGeometry: boolean = false;

    constructor()
    {
        super();
    }

    public addTile(texture: PIXI.Texture, x: number, y: number, options: Partial<ITileOptions> = {} ): void
    {
        const tile: ITileData = {
            texture: texture,
            x: x,
            y: y,
            width: options.width || texture.width,
            height: options.height || texture.height,
            anchor: options.anchor || new PIXI.Point(0.5, 0.5),
            light: options.light || [0, 0, 0, 1],
            scale: options.scale || new PIXI.Point(1, 1)
        };
  
        // this.tiles.push(tile);
    }

    setGetTilesForRenderFunction(func: () => Array<ITileData>): void
    {
        this.getTilesForRenderCallback = func;
    }

    render(renderer: PIXI.Renderer): void 
    {
        renderer.batch.setObjectRenderer(renderer.plugins['customTilemap']);

        if (this.bShouldUpdateGeometry)
        {
            this.updateGeometry();
        }

        renderer.plugins['customTilemap'].render(this);
    }

    updateGeometry()
    {
        const timeA = Date.now();
        if (this.geometry)
        {
            this.geometry.destroy();
        }
        
        this.geometry = new TilemapGeometry();
        this.geometry.baseTextures = [];

        if (!this.getTilesForRenderCallback)
        {
            return;
        }

        const tiles = this.getTilesForRenderCallback();

        this.geometry.indicesBuffer = new Uint32Array(tiles.length * 6);

        const positionBuffer = new Float32Array(tiles.length * 4 * 2);
        const uvBuffer = new Float32Array(tiles.length * 4 * 2);
        const textureIDsBuffer = new Float32Array(tiles.length * 4 * 1);
        const lightColorBuffer = new Float32Array(tiles.length * 4 * 3);

        this.geometry.addProperty('aPosition', positionBuffer, this.geometry.updatePosition, 2);
        this.geometry.addProperty('aTextureCoord', uvBuffer, this.geometry.updateUV, 2);
        this.geometry.addProperty('aTextureId', textureIDsBuffer, this.geometry.updateTextureID, 1);
        this.geometry.addProperty('aLightColor', lightColorBuffer, this.geometry.updateLightColor, 3);

        let vertexIndex = 0;
        /** Update properties buffers for every tile */
        for (let i = 0; i < tiles.length; i++)
        {
            const tile = tiles[i];
            for (let propertyName in this.geometry.properties)
            {
                const property = this.geometry.properties[propertyName];

                const offset = i * property.size * 4;

                property.updateFunction(property.buffer, offset, tile);
            }

            const indexOffset = i * 6;
            const indices = [0, 1, 2, 0, 2, 3];

            for (let j = 0; j < 6; j++)
            {
                this.geometry.indicesBuffer[indexOffset + j] = vertexIndex + indices[j];
            }

            vertexIndex += 4;
        }

        /** Copy data from {properties} to {attributes} */
        for (let propertyName in this.geometry.properties)
        {
            const property = this.geometry.properties[propertyName];

            this.geometry.addAttribute(property.name, property.buffer, property.size);
        } 
        
        this.geometry.addIndex(this.geometry.indicesBuffer);
        this.bShouldUpdateGeometry = false;

        const timeB = Date.now();
        console.log(`[Tilemap] Updating geometry took ${timeB - timeA} ms`);
    }
}