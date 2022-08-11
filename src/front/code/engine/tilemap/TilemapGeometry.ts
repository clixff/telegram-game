import * as PIXI from 'pixi.js';
import { ITileData } from './TilemapContainer';

type updateFunctionType = (buffer: Float32Array, offset: number, tileData: ITileData) => void;

export interface IGeometryAttribute
{
    name: string;
    buffer: Float32Array;
    updateFunction: updateFunctionType;
    /** Bytes per vertex */
    size: number;
}

export class TilemapGeometry extends PIXI.Geometry
{
    properties: Record<string, IGeometryAttribute> = {};

    baseTextures: Array<PIXI.BaseTexture> = [];

    indicesBuffer: Uint32Array = new Uint32Array();

    constructor()
    {
        super();
    }

    addProperty(name: string, buffer: Float32Array, updateFunction: updateFunctionType, size: number)
    {
        const func = updateFunction.bind(this);

        this.properties[name] = {
            name,
            buffer,
            updateFunction: func,
            size
        };
    }

    updatePosition(buffer: Float32Array, offset: number, tileData: ITileData)
    {
        const anchor = tileData.anchor;
        const scaleX = tileData.scale.x;
        const scaleY = tileData.scale.y;

        const width0 = ((tileData.width * (1 - anchor.x)) * scaleX) + tileData.x;
        const width1 = ((tileData.width * -(anchor.x)) * scaleX) + tileData.x;

        const height0 = ((tileData.height * (1 - anchor.y)) * scaleY) + tileData.y;
        const height1 = ((tileData.height * -(anchor.y)) * scaleY) + tileData.y;

        const vertices = [
            width1, height1,
            width0, height1,
            width0, height0,
            width1, height0
        ];

        for (let j = 0; j < vertices.length; j++)
        {
            buffer[offset + j] = vertices[j];
        }
    }

    updateUV(buffer: Float32Array, offset: number, tileData: ITileData)
    {
        const uv = tileData.texture._uvs.uvsFloat32;

        for (let j = 0; j < uv.length; j++)
        {
            buffer[offset + j] = uv[j];
        }
    }

    updateTextureID(buffer: Float32Array, offset: number, tileData: ITileData)
    {
        let textureID = this.baseTextures.indexOf(tileData.texture.baseTexture);

        if (textureID === -1)
        {
            this.baseTextures.push(tileData.texture.baseTexture);
            textureID = this.baseTextures.length - 1;
        }

        for (let j = 0; j < 4; j++)
        {
            buffer[offset + j] = textureID;
        }
    }

    updateLightColor(buffer: Float32Array, offset: number, tileData: ITileData)
    {
        for (let j = 0; j < 12; j++)
        {
            buffer[offset + j] = (tileData.light[j % 3]) * tileData.light[3];
        }
    }
}