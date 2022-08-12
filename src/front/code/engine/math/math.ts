import { IVector } from "../core/GameInstance";

export function clamp(value: number, min: number, max: number): number
{
    return value < min ? min : value > max ? max : value;
}

export function getVectorLength(vector: IVector): number
{
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function normalizeVector(vector: IVector): IVector
{
    const length = getVectorLength(vector);

    if (length === 0)
    {
        return { x: 0, y: 0 };
    }

    return { x: vector.x / length, y: vector.y / length };
}

export function randomInteger(min: number, max: number): number
{
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export function lerp(min: number, max: number, alpha: number): number
{
    return min + (max - min) * alpha;
}

export function rgbToHex(r: number, g: number, b: number): number
{
    return (Math.floor(r * 255) << 16) + (Math.floor(g * 255) << 8) + Math.floor(b * 255);
}

