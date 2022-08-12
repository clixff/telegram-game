import * as PIXI from 'pixi.js';
import { lerp } from '../math/math';

/** Time, value */
type ICurveFloatPoint = [number, number];

export class CurveFloat
{
    points: ICurveFloatPoint[] = [];
    constructor(points: ICurveFloatPoint[])
    {
        this.setPoints(points);
    }

    setPoints(points: ICurveFloatPoint[])
    {
        this.points = points;
        this.points.sort((a, b) =>
        {
            if (a[0] < b[0])
            {
                return -1;
            }
            else if (a[0] > b[0])
            {
                return 1;
            }
            else
            {
                return 0;
            }
        });

        console.log(this.points);
    }

    getValue(time: number): number
    {
        if (this.points.length === 0)
        {
            return 0;
        }

        if (this.points.length === 1)
        {
            return this.points[0][1];
        }

        /** Return last item */
        if (this.points[this.points.length - 1][0] <= time)
        {
            return this.points[this.points.length - 1][1];
        }

        let minPointIndex = 0;

        /** Find point for this value */
        for (let i = 0; i < this.points.length - 1; i++)
        {
            if (this.points[i + 1][0] >= time)
            {
                minPointIndex = i;
                break;
            }
        }

        const maxPointIndex = minPointIndex + 1;

        const pointA = this.points[minPointIndex];
        const pointB = this.points[maxPointIndex];

        if (!pointB)
        {
            return pointA[1];
        }

        const timeNormalized = (time - pointA[0]) / (pointB[0] - pointA[0]);

        return lerp(pointA[1], pointB[1], timeNormalized);
    }
}